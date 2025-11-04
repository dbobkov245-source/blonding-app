// api/proxy.js

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { inputs } = request.body;
    if (!inputs) {
      return response.status(400).json({ error: 'No "inputs" field provided' });
    }

    const HF_TOKEN = process.env.HF_TOKEN;
    if (!HF_TOKEN) {
      console.error("HF_TOKEN is not set");
      return response.status(500).json({ error: 'Server configuration error' });
    }

    // --- ИСПРАВЛЕНИЕ: ВОЗВРАЩАЕМСЯ К ПРАВИЛЬНОМУ API-АДРЕСУ ---
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/google/gemma-7b-it", 
      {
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          inputs: inputs,
          options: { wait_for_model: false }
        }), 
      }
    );

    // --- НАДЕЖНАЯ ПРОВЕРКА ОТВЕТА ---
    let responseBody;
    const contentType = hfResponse.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      // Если пришел JSON, читаем его
      responseBody = await hfResponse.json();
    } else {
      // Если пришел НЕ JSON (HTML-ошибка, "Not Found", и т.д.)
      const errorText = await hfResponse.text();
      console.error("HF API non-JSON response:", errorText);

      if (hfResponse.status === 404) {
         throw new Error("Model not found (404). Check model name.");
      }

      // Проверяем на "холодный старт"
      if (hfResponse.status === 503 || errorText.includes("loading")) {
        responseBody = { "model_is_loading": true, "estimated_time": 30 };
      } else {
        // Это "Not Found" или другая текстовая ошибка
        throw new Error(errorText);
      }
    }
    // --- КОНЕЦ ПРОВЕРКИ ---

    // Теперь у нас 100% есть 'responseBody'

    // Проверяем, "просыпается" ли модель
    if (responseBody.model_is_loading) {
      return response.status(200).json({
        "model_is_loading": true,
        "estimated_time": responseBody.estimated_time || 30
      });
    }

    // Если это другая ошибка в JSON (например, 401 Unauthorized)
    if (!hfResponse.ok) {
      console.error("HF API Error (JSON):", responseBody);
      return response.status(hfResponse.status).json({ error: 'HF API Error', details: responseBody });
    }

    // Если все хорошо, отправляем успешный результат
    response.status(200).json(responseBody);

  } catch (error) {
    // Ловим любые ошибки (включая "Not Found" из throw)
    console.error("Proxy Catch Block Error:", error.message);
    response.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
