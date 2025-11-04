import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';

// Импортируем наш JSON-файл с тестом
import quizData from '../content/quizzes/lesson-1-quiz.json';

function Quizzes() {
  const [quiz, setQuiz] = useState([]);
  const [showAnswers, setShowAnswers] = useState(false);

  // Загружаем тест при первом рендере
  useEffect(() => {
    // В будущем здесь можно будет загружать разные тесты
    setQuiz(quizData); 
  }, []);

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

      {/* --- Заголовок --- */}
      <header className="text-center mb-8">
        <h1 className="font-heading text-3xl font-bold text-text-primary mb-2">
          Тест: Урок 1
        </h1>
        <p className="text-lg text-text-secondary">
          Проверьте свои знания по подготовке к блондированию.
        </p>
      </header>

      {/* --- Контейнер с вопросами --- */}
      <div className="space-y-6">
        {quiz.map((item, index) => (
          <div 
            key={index} 
            className="bg-surface rounded-lg shadow-sm border border-slate-200 p-6"
          >
            {/* Вопрос */}
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              {index + 1}. {item.question}
            </h3>
            
            {/* Варианты ответов */}
            <div className="space-y-2">
              {item.options.map((option, i) => (
                <div 
                  key={i}
                  className={`
                    p-3 rounded-md border
                    ${showAnswers && option === item.correctAnswer 
                      ? 'bg-green-50 border-green-300 text-green-800' // Правильный
                      : 'bg-slate-50 border-slate-200 text-text-secondary' // Обычный
                    }
                  `}
                >
                  <span className="flex items-center">
                    {showAnswers && option === item.correctAnswer && (
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                    )}
                    {showAnswers && option !== item.correctAnswer && (
                      <X className="w-4 h-4 mr-2 text-red-400" />
                    )}
                    {option}
                  </span>
                </div>
              ))}
            </div>

            {/* Ответ и объяснение (скрыто) */}
            {showAnswers && (
              <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-md">
                <p className="font-semibold text-primary">Объяснение:</p>
                <p className="text-sm text-text-primary">{item.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* --- Кнопка "Показать ответы" --- */}
      <div className="text-center mt-8">
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="font-bold text-white bg-primary hover:bg-primary-hover px-6 py-3 rounded-md text-center transition-colors"
        >
          {showAnswers ? 'Скрыть ответы' : 'Показать ответы'}
        </button>
      </div>
    </div>
  );
}

export default Quizzes;
