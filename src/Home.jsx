import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckSquare, Brain } from 'lucide-react'; // 👈 Шаг 4 (см. ниже)

// ... (Весь ваш код с 'import.meta.glob' и 'lessons' остается БЕЗ ИЗМЕНЕНИЙ) ...
const lessonModules = import.meta.glob('./content/theory/*.md', { 
  /* ... */ 
});
const lessons = Object.entries(lessonModules).map(([path, content]) => {
  /* ... */
});
lessons.sort((a, b) => 
  a.id.localeCompare(b.id, undefined, { numeric: true })
);
// (КОНЕЦ КОДА ОСТАЕТСЯ ТЕМ ЖЕ)

function Home() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="font-heading text-4xl font-bold text-text-primary mb-2">
          Курс по Блондированию
        </h1>
        <p className="text-lg text-text-secondary">
          Все материалы, тесты и чек-листы в одном месте.
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* === Блок Уроков (Занимает 2/3) === */}
        <div className="md:col-span-2 bg-surface rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="font-heading text-2xl font-semibold text-text-primary mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-primary" />
            Теория
          </h2>
          <div className="flex flex-col space-y-3">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                to={lesson.path}
                className="font-medium text-text-primary bg-background hover:bg-slate-100 p-4 rounded-md transition-colors"
              >
                {lesson.title}
              </Link>
            ))}
            {lessons.length === 0 && (
              <p className="text-text-secondary">Уроки скоро появятся...</p>
            )}
          </div>
        </div>

        {/* === Блок Тестов (Занимает 1/3) === */}
        <div className="bg-surface rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="font-heading text-2xl font-semibold text-text-primary mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-accent" />
            Практика
          </h2>
          <div className="flex flex-col space-y-3">
            <Link
              to="/quizzes"
              className="font-bold text-white bg-accent hover:bg-accent-hover p-4 rounded-md text-center transition-colors"
            >
              📝 Пройти тесты
            </Link>
          </div>
        </div>

        {/* === (Опционально) Блок Чек-листов (Занимает 1/3) === */}
        {/* <div className="bg-surface rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="font-heading text-2xl font-semibold text-text-primary mb-4 flex items-center">
            <CheckSquare className="w-5 h-5 mr-2 text-blue-500" />
            Чек-листы
          </h2>
          <p className="text-text-secondary">Скоро...</p>
        </div> 
        */}

      </main>
    </div>
  );
}

export default Home;
