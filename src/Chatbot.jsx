// src/Chatbot.jsx
import React, { useState } from 'react';
import { Send, Loader2, Brain } from 'lucide-react'; // Используем иконки

export default function Chatbot() {
  // Сообщения чата
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Здравствуйте! Я ассистент по блондированию. Задайте мне вопрос.' }
  ]);
  // Текст в поле ввода
  const [input, setInput] = useState("");
  // Состояние загрузки
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setLoading(true);
    setInput("");
    
    // Добавляем сообщение пользователя в чат
    setMessages(prev => [...prev, { from: 'user', text: userMessage }]);

    try {
      // Отправляем запрос на НАШ API-посредник (Шаг 1)
      const response = await fetch(
        '/api/proxy', // Vercel поймет этот путь
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: userMessage }),
        }
      );

      if (!response.ok) {
        throw new Error('Ошибка сети. Попробуйте позже.');
      }

      const result = await response.json();
      
      let botResponse = "Извините, я не смог обработать запрос.";
      if (result && result[0] && result[0].generated_text) {
        // Модель часто повторяет вопрос, мы его "отрезаем"
        const rawText = result[0].generated_text;
        botResponse = rawText.replace(userMessage, "").trim();
        // Если ответ стал пустым, возвращаем полный текст
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

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-slate-200 p-6 h-[500px] flex flex-col">
      <h2 className="font-heading text-2xl font-semibold text-text-primary mb-4 flex items-center">
        <Brain className="w-5 h-5 mr-2 text-primary" />
        AI-Ассистент
      </h2>
      
      {/* Окно чата */}
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
      
      {/* Поле ввода */}
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
