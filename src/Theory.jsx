import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react'; // 👈 Шаг 4 (см. ниже)

function Theory() {
  const { lessonId } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const module = await import(`./content/theory/${lessonId}.md?raw`);
        setContent(module.default);
      } catch (error) {
        console.error('Ошибка загрузки урока:', error);
        setContent('# Ошибка\n\nНе удалось загрузить содержимое урока.');
      }
      setLoading(false);
    };
    loadLesson();
  }, [lessonId]);

  if (loading) {
    return (
      <div className="text-center py-20 text-text-secondary">Загрузка...</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      {/* --- Кнопка Назад --- */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Вернуться на главную
        </Link>
      </div>

      {/* --- Контент Урока --- */}
      <div className="bg-surface rounded-lg shadow-sm border border-slate-200 p-6 md:p-10">
        <article className="prose prose-lg max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}

export default Theory;
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
