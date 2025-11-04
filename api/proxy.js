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

    // 1. --- ИЗМЕНЕНИЕ: ИСПОЛЬЗУЕМ НОВЫЙ URL API ---
    const hfResponse = await fetch(
      "https://router.huggingface.co/HF_inference", // <-- Новый URL
      {
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        method: "POST,
        // 2. --- ИЗМЕНЕНИЕ: ОТПРАВЛЯЕМ МОДЕЛЬ В ТЕЛЕ ЗАПРОСА ---
        body: JSON.stringify({
          model: "google/gemma-7b-it", // <-- Модель теперь здесь
          inputs: inputs,
          options: { wait_for_model: false }
        }), 
      }
    );

    const responseBody = await hfResponse.json(); 

    if (!hfResponse.ok) {
      console.error("HF API Error:", responseBody); 

      if (responseBody.error && typeof responseBody.error === 'string' && responseBody.error.includes("is currently loading")) {
        return response.status(200).json({
          "model_is_loading": true,
          "estimated_time": responseBody.estimated_time || 30
        });
      }

      return response.status(hfResponse.status).json({ error: 'HF API Error', details: responseBody });
    }

    response.status(200).json(responseBody);

  } catch (error) {
    console.error("Proxy Catch Block Error:", error.message);
    response.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
