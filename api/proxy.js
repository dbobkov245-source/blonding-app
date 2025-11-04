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
   
    // НОВЫЙ URL для унифицированного эндпоинта роутера (OpenAI-совместимый)
    const url = "https://router.huggingface.co/v1/chat/completions";
    console.log("Request URL:", url);
   
    const hfResponse = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct:fastest",  // Твоя текущая модель
        messages: [
          {
            role: "user",
            content: inputs
          }
        ],
        max_tokens: 1024,  // Увеличили до 1024 для более длинных ответов (можно до 4096, но зависит от провайдера и подписки)
        temperature: 0.7,
        top_p: 0.95
      })
    });
   
    console.log("Response status:", hfResponse.status);
   
    const contentType = hfResponse.headers.get("content-type");
    let responseBody;
   
    if (contentType && contentType.includes("application/json")) {
      responseBody = await hfResponse.json();
    } else {
      const textResponse = await hfResponse.text();
      console.error("Non-JSON response:", textResponse);
      return response.status(hfResponse.status).json({
        error: 'Invalid API response',
        details: textResponse,
        status: hfResponse.status
      });
    }
   
    console.log("Response body:", JSON.stringify(responseBody, null, 2));
   
    if (!hfResponse.ok) {
      console.error("HF API Error:", responseBody);
     
      // Проверяем "холодный старт" (в новом формате ошибка может быть похожей)
      if (responseBody.error && typeof responseBody.error === 'string' &&
          (responseBody.error.includes("is currently loading") || responseBody.estimated_time)) {
        return response.status(503).json({
          model_is_loading: true,
          estimated_time: responseBody.estimated_time || 30
        });
      }
     
      return response.status(hfResponse.status).json({
        error: 'HF API Error',
        details: responseBody
      });
    }
   
    // Успешный ответ: извлекаем сгенерированный текст из нового формата
    const generatedText = responseBody.choices[0].message.content;
    return response.status(200).json([{ generated_text: generatedText }]);  // Возвращаем в старом формате для совместимости
   
  } catch (error) {
    console.error("Proxy Catch Block Error:", error.message);
    return response.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
}
