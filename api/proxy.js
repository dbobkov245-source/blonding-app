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
    
    const hfResponse = await fetch(
      "https://router.huggingface.co/hf-inference",
      {
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          model: "google/gemma-7b-it",
          inputs: inputs,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false
          }
        })
      }
    );
    
    // Проверяем Content-Type перед парсингом
    const contentType = hfResponse.headers.get("content-type");
    let responseBody;
    
    if (contentType && contentType.includes("application/json")) {
      responseBody = await hfResponse.json();
    } else {
      // Если не JSON, читаем как текст
      const textResponse = await hfResponse.text();
      console.error("Non-JSON response:", textResponse);
      return response.status(hfResponse.status).json({ 
        error: 'Invalid API response', 
        details: textResponse,
        status: hfResponse.status
      });
    }
    
    if (!hfResponse.ok) {
      console.error("HF API Error:", responseBody); 
      
      // Проверяем "холодный старт"
      if (responseBody.error && typeof responseBody.error === 'string' && 
          responseBody.error.includes("is currently loading")) {
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
    
    // Успешный ответ
    return response.status(200).json(responseBody);
    
  } catch (error) {
    console.error("Proxy Catch Block Error:", error.message);
    return response.status(500).json({ 
      error: 'Internal Server Error', 
      details: error.message 
    });
  }
}
