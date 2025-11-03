import React from 'react';
import { Link } from 'react-router-dom';

function Quizzes() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">
          Тесты
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Раздел в разработке
          </h2>
          <p className="text-gray-600 mb-6">
            Здесь будут интерактивные тесты для проверки знаний.
          </p>
          <Link
            to="/"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Quizzes;