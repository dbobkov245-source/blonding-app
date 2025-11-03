import React from 'react';
import { Link } from 'react-router-dom';

// --- 1. АВТОМАТИЗАЦИЯ ---
// Эта магия от Vite сканирует папку 'content/theory'
// и загружает ВСЕ .md файлы оттуда как сырой текст.
const lessonModules = import.meta.glob('./content/theory/*.md', {
  eager: true, // Загрузить немедленно
  as: 'raw',   // Импортировать как сырой текст
});

// --- 2. ОБРАБОТКА ФАЙЛОВ ---
// Мы превращаем объект с файлами в удобный массив
const lessons = Object.entries(lessonModules).map(([path, content]) => {
  // path (путь) = "./content/theory/lesson-1.md"
  
  // 2.1. Извлекаем ID урока (например, "lesson-1")
  const lessonId = path.split('/').pop().replace('.md', '');
  
  // 2.2. Извлекаем заголовок из .md файла (первую строку)
  const firstLine = content.trim().split('\n')[0];
  const title = firstLine.replace(/^#\s*/, '').trim(); // Убираем "#"

  return {
    id: lessonId,
    title: title || lessonId, // "Урок 1: Подготовка..." или просто "lesson-1"
    path: `/theory/${lessonId}`,
  };
});

// 2.3. Сортируем уроки, чтобы они шли по порядку
lessons.sort((a, b) => 
  a.id.localeCompare(b.id, undefined, { numeric: true })
);

// --- 3. РЕНДЕРИНГ ---
function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">
          Курс по блондированию
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Доступные уроки:
          </h2>

          {/* 4. Автоматически создаем список ссылок */}
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
          </div>
          
          {/* Сообщение, если уроки не найдены */}
          {lessons.length === 0 && (
            <p className="text-gray-500">
              Новые уроки скоро появятся...
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

export default Home;
