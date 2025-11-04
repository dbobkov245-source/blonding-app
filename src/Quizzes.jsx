import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, X, RefreshCw } from 'lucide-react';

// Импортируем наш JSON-файл с тестом
import quizData from './content/quizzes/lesson-1-quiz.json';

function Quizzes() {
  const [quiz, setQuiz] = useState([]);
  // НОВОЕ СОСТОЯНИЕ: Хранит ответы пользователя (вопрос: ответ)
  // Например: { 0: "Пористость...", 1: "За 1 час" }
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    setQuiz(quizData);
  }, []);

  // НОВАЯ ФУНКЦИЯ: Срабатывает при клике на вариант
  const handleAnswerClick = (questionIndex, selectedOption) => {
    // Не даем изменить ответ, если он уже дан
    if (selectedAnswers[questionIndex] !== undefined) {
      return;
    }

    // Записываем ответ пользователя
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: selectedOption,
    });
  };

  // НОВАЯ ФУНКЦИЯ: Сброс теста
  const resetQuiz = () => {
    setSelectedAnswers({});
  };

  // НОВАЯ ФУНКЦИЯ: Определяет, как покрасить кнопку
  const getButtonClass = (questionIndex, option) => {
    const isSelected = selectedAnswers[questionIndex] === option;
    const isCorrect = quiz[questionIndex]?.correctAnswer === option;
    const answerGiven = selectedAnswers[questionIndex] !== undefined;

    // Если ответ еще не дан, кнопка обычная
    if (!answerGiven) {
      return 'bg-slate-50 border-slate-200 text-text-secondary hover:bg-slate-100';
    }

    // Если ответ дан:
    if (isCorrect) {
      // Это правильный ответ (всегда зеленый)
      return 'bg-green-50 border-green-300 text-green-800';
    }
    if (isSelected && !isCorrect) {
      // Это ВЫБРАННЫЙ, но НЕПРАВИЛЬНЫЙ ответ (красный)
      return 'bg-red-50 border-red-300 text-red-800';
    }
    
    // Это невыбранный, неправильный ответ (серый)
    return 'bg-slate-50 border-slate-200 text-text-secondary opacity-70';
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      {/* ... Кнопка Назад и Заголовок (остаются без изменений) ... */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Вернуться на главную
        </Link>
      </div>
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
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              {index + 1}. {item.question}
            </h3>
            
            {/* ИЗМЕНЕНИЕ: Теперь это кнопки */}
            <div className="space-y-2">
              {item.options.map((option, i) => (
                <button 
                  key={i}
                  onClick={() => handleAnswerClick(index, option)}
                  disabled={selectedAnswers[index] !== undefined} // Блокируем после ответа
                  className={`
                    w-full p-3 rounded-md border text-left transition-colors
                    ${getButtonClass(index, option)}
                  `}
                >
                  <span className="flex items-center">
                    {/* Показываем иконку в зависимости от состояния */}
                    {selectedAnswers[index] !== undefined && item.correctAnswer === option && (
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                    )}
                    {selectedAnswers[index] === option && item.correctAnswer !== option && (
                      <X className="w-4 h-4 mr-2 text-red-600" />
                    )}
                    {option}
                  </span>
                </button>
              ))}
            </div>

            {/* Объяснение (появляется после ответа) */}
            {selectedAnswers[index] !== undefined && (
              <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-md">
                <p className="font-semibold text-primary">Объяснение:</p>
                <p className="text-sm text-text-primary">{item.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ИЗМЕНЕНИЕ: Кнопка "Сбросить" вместо "Показать" */}
      <div className="text-center mt-8">
        <button
          onClick={resetQuiz}
          className="font-bold text-white bg-primary hover:bg-primary-hover px-6 py-3 rounded-md text-center transition-colors inline-flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Сбросить тест
        </button>
      </div>
    </div>
  );
}

export default Quizzes;
