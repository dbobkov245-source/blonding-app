// src/Chatbot.jsx
import React, { useState } from 'react';
import { Send, Loader2, Brain } from 'lucide-react';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Здравствуйте! Я ассистент по блондированию. Задайте мне вопрос.' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setLoading(true);
    setInput("");

    setMessages(prev => [...prev, { from: 'user', text: userMessage }]);

    try {
      const response = await fetch('/api/proxy', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Ошибка сети. Попробуйте позже.');
      }

      const result = await response.json();

      // --- НОВАЯ ЛОГИКА ОБРАБОТКИ ОТВЕТА ---
      // Проверяем, "просыпается" ли модель
      if (result.model_is_loading) {
        setMessages(prev => [...prev, { 
          from: 'bot', 
          text: `Модель "просыпается"... Пожалуйста, подождите ${Math.round(result.estimated_time)} секунд и отправьте ваш запрос еще раз.` 
        }]);
        setLoading(false);
        return; // Завершаем, ждем нового запроса от пользователя
      }
      // --- КОНЕЦ НОВОЙ ЛОГИКИ ---

      let botResponse = "Извините, я не смог обработать запрос.";
      if (result && result[0] && result[0].generated_text) {
        const rawText = result[0].generated_text;
        botResponse = rawText.replace(userMessage, "").trim();
        if (botResponse.length < 2) botResponse = rawText; 
      }

      setMessages(prev => [...prev, { from: 'bot', text: botResponse }]);

    } catch (error) {
      console.error("Ошибка при запросе к proxy:", error);
      setMessages(prev => [...prev, { from: 'bot', text: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  // ... (остальной JSX код остается таким же) ...
  return (
    <div className="bg-surface rounded-lg shadow-sm border border-slate-200 p-6 h-[500px] flex flex-col">
      <h2 className="font-heading text-2xl font-semibold text-text-primary mb-4 flex items-center">
        <Brain className="w-5 h-5 mr-2 text-primary" />
        AI-Ассистент
      </h2>

      <div className="flex-grow overflow-y-auto mb-4 space-y-4 pr-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg px-4 py-2 shadow-sm ${msg.from === 'user' ? 'bg-primary text-white' : 'bg-background text-text-primary'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg px-4 py-2 bg-background text-text-primary shadow-sm">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Как избежать желтизны?"
          className="flex-grow p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-primary text-white p-3 rounded-md hover:bg-primary-hover disabled:opacity-50"
          disabled={loading}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
