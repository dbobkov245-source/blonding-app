import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

function Theory() {
  const { lessonId } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загружаем содержимое Markdown файла
    fetch(`/src/content/theory/${lessonId}.md`)
      .then(response => response.text())
      .then(text => {
        setContent(text);
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка загрузки урока:', error);
        setContent('# Ошибка\n\nНе удалось загрузить содержимое урока.');
        setLoading(false);
      });
  }, [lessonId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-2xl text-purple-800">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-block mb-6 text-purple-600 hover:text-purple-800 font-semibold"
        >
          ← Вернуться на главную
        </Link>
        <div className="bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default Theory;
