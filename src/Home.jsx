import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">
          Курс по блондированию
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Добро пожаловать!
          </h2>
          <p className="text-gray-600 mb-6">
            Начните изучение с первого урока:
          </p>
          <Link
            to="/theory/lesson-1"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Урок 1: Подготовка клиента к блондированию
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
