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
    
    // Добавляем отладочную информацию
    console.log("HF_TOKEN exists:", !!HF_TOKEN);
    console.log("HF_TOKEN starts with:", HF_TOKEN.substring(0, 7));
    
    // Пробуем новый chat completions endpoint
    const url = "https://api-inference.huggingface.co/models/google/gemma-7b-it/v1/chat/completions";
    console.log("Request URL:", url);
    
    const hfResponse = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        model: "google/gemma-7b-it",
        messages: [
          { role: "user", content: inputs }
        ],
        max_tokens: 250,
        temperature: 0.7,
        stream: false
      })
    });
    
    console.log("Response status:", hfResponse.status);
    console.log("Response content-type:", hfResponse.headers.get("content-type"));
    
    // Проверяем Content-Type перед парсингом
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
        status: hfResponse.status,
        url: url
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
    
    // Преобразуем ответ в формат для фронтенда
    let finalResponse;
    if (responseBody.choices && responseBody.choices[0]?.message?.content) {
      // Формат chat completions
      finalResponse = [{
        generated_text: responseBody.choices[0].message.content
      }];
    } else {
      finalResponse = responseBody;
    }
    
    return response.status(200).json(finalResponse);
    
  } catch (error) {
    console.error("Proxy Catch Block Error:", error.message);
    return response.status(500).json({ 
      error: 'Internal Server Error', 
      details: error.message 
    });
  }
}
