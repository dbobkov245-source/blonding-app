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

    // --- НОВАЯ УЛУЧШЕННАЯ ЛОГИКА ОБРАБОТКИ ОШИБОК ---
    if (!hfResponse.ok) {
      let errorPayload = { error: `HF API error: ${hfResponse.statusText}` };

      // Проверяем, пришел ли ответ в JSON
      const contentType = hfResponse.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        errorPayload = await hfResponse.json();
      } else {
        // Если пришел не JSON (например, HTML-страница ошибки), читаем как текст
        const errorText = await hfResponse.text();
        console.error("HF API non-JSON error:", errorText);
        // Устанавливаем специальную ошибку для "холодного старта"
        if (hfResponse.status === 503 || errorText.includes("loading")) {
          errorPayload = { "model_is_loading": true, "estimated_time": 30 };
        }
      }

      // Проверяем, "просыпается" ли модель
      if (errorPayload.error && errorPayload.error.includes("is currently loading") || errorPayload.model_is_loading) {
        return response.status(200).json({
          "model_is_loading": true,
          "estimated_time": errorPayload.estimated_time || 30
        });
      }

      console.error("HF API Error:", errorPayload);
      throw new Error(errorPayload.error);
    }
    // --- КОНЕЦ НОВОЙ ЛОГИКИ ---

    const result = await hfResponse.json();
    response.status(200).json(result);

  } catch (error) {
    console.error("Proxy Error:", error.message);
    response.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
