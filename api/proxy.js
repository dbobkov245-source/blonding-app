// api/proxy.js

export default async function handler(request, response) {
  // 1. Проверяем метод
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 2. Проверяем, что 'inputs' пришли
    const { inputs } = request.body;
    if (!inputs) {
      return response.status(400).json({ error: 'No "inputs" field provided in body' });
    }

    // 3. Проверяем, что токен существует (вы его добавили в Vercel)
    const HF_TOKEN = process.env.HF_TOKEN;
    if (!HF_TOKEN) {
      console.error("HF_TOKEN is not set in Vercel Environment Variables");
      return response.status(500).json({ error: 'Server configuration error' });
    }

    // 4. Делаем запрос на Hugging Face
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/google/gemma-7b-it",
      {
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        method: "POST",
        // Добавляем опцию: не ждать, если модель не загружена
        body: JSON.stringify({ inputs: inputs, options: { wait_for_model: false } }), 
      }
    );

    // 5. Пытаемся прочитать ответ как JSON
    const responseBody = await hfResponse.json(); 

    // 6. Если Hugging Face вернул ошибку
    if (!hfResponse.ok) {
      console.error("HF API Error:", responseBody); // Логируем ошибку

      // Проверяем, "просыпается" ли модель
      if (responseBody.error && typeof responseBody.error === 'string' && responseBody.error.includes("is currently loading")) {
        return response.status(200).json({ // Отправляем 200 OK с особым телом
          "model_is_loading": true,
          "estimated_time": responseBody.estimated_time || 30
        });
      }

      // Для любой другой ошибки (например, 401 Unauthorized)
      return response.status(hfResponse.status).json({ error: 'HF API Error', details: responseBody });
    }

    // 7. Если все хорошо, отправляем успешный результат
    response.status(200).json(responseBody);

  } catch (error) {
    // Эта секция сработает, если 'fetch' упадет или 'hfResponse.json()' не сработает
    console.error("Proxy Catch Block Error:", error.message);
    response.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
