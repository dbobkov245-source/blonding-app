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
    
    // Правильный URL с моделью в пути
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
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false
          }
        })
      }
    );
    
    const responseBody = await hfResponse.json(); 
    
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
