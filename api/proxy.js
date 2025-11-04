// api/proxy.js
// Это Node.js код, который будет работать на сервере Vercel

export default async function handler(request, response) {
  // 1. Принимаем только POST-запросы
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 2. Получаем сообщение пользователя из тела запроса
    const { inputs } = request.body;

    // 3. Получаем СЕКРЕТНЫЙ ключ (который вы ввели в Vercel)
    const HF_TOKEN = process.env.HF_TOKEN;

    // 4. Делаем безопасный запрос на Hugging Face
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
      {
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ inputs: inputs }),
      }
    );

    if (!hfResponse.ok) {
      console.error("HF API Error:", await hfResponse.text());
      throw new Error(`HF API error: ${hfResponse.statusText}`);
    }

    const result = await hfResponse.json();

    // 5. Отправляем ответ обратно в React-приложение
    response.status(200).json(result);

  } catch (error) {
    console.error("Proxy Error:", error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
}
