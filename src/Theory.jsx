import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';

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
