import React from 'react';
import { Link } from 'react-router-dom';

// ... (Весь ваш код с 'import.meta.glob' и 'lessons' остается БЕЗ ИЗМЕНЕНИЙ) ...
// (НАЧАЛО КОДА ОСТАЕТСЯ ТЕМ ЖЕ)
// ...
const lessonModules = import.meta.glob('./content/theory/*.md', {
  eager: true,
  as: 'raw',
});

const lessons = Object.entries(lessonModules).map(([path, content]) => {
  const lessonId = path.split('/').pop().replace('.md', '');
  const firstLine = content.trim().split('\n')[0];
  const title = firstLine.replace(/^#\s*/, '').trim();
  return {
    id: lessonId,
    title: title || lessonId,
    path: `/theory/${lessonId}`,
  };
});
lessons.sort((a, b) => 
  a.id.localeCompare(b.id, undefined, { numeric: true })
);
// (КОНЕЦ КОДА ОСТАЕТСЯ ТЕМ ЖЕ)
// ...


// --- 3. РЕНДЕРИНГ (Вот здесь будут изменения) ---
function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-purple-800">
          Курс по блондированию
        </h1>

        {/* === РАЗДЕЛ УРОКОВ (Уже существует) === */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Теория
          </h2>
          <div className="flex flex-col space-y-4">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                to={lesson.path}
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                {lesson.title}
              </Link>
            ))}
            {lessons.length === 0 && (
              <p className="text-gray-500">Уроки скоро появятся...</p>
            )}
          </div>
        </div>

        {/* === РАЗДЕЛ ИНСТРУМЕНТОВ (Новый) === */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Повторение и практика
          </h2>
          <div className="flex flex-col space-y-4">
            {/* ⬇️ НАША НОВАЯ ССЫЛКА ⬇️ */}
            <Link
              to="/quizzes"
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              📝 Пройти тесты
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
