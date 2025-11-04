// api/proxy.js

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { inputs } = request.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/google/gemma-7b-it",
      {
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ inputs: inputs }),
      }
    );

    // --- НОВАЯ ЛОГИКА ОБРАБОТКИ ОШИБОК ---
    if (!hfResponse.ok) {
      const errorPayload = await hfResponse.json();

      // Проверяем, "просыпается" ли модель
      if (errorPayload.error && errorPayload.error.includes("is currently loading")) {
        // Это НЕ ошибка, это "холодный старт"
        // Отправляем особый ответ, который поймет React
        return response.status(200).json({
          "model_is_loading": true,
          "estimated_time": errorPayload.estimated_time || 30
        });
      }

      // Если это другая ошибка (например, 401)
      console.error("HF API Error:", errorPayload);
      throw new Error(`HF API error: ${hfResponse.statusText}`);
    }
    // --- КОНЕЦ НОВОЙ ЛОГИКИ ---

    const result = await hfResponse.json();
    response.status(200).json(result);

  } catch (error) {
    console.error("Proxy Error:", error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
}
