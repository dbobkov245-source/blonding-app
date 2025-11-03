import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Theory from './Theory';
import Quizzes from './Quizzes'; // <-- 1. ИМПОРТИРУЕМ НОВУЮ СТРАНИЦУ

const base = import.meta.env.BASE_URL;

function App() {
  return (
    <BrowserRouter basename={base}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/theory/:lessonId" element={<Theory />} />
        <Route path="/quizzes" element={<Quizzes />} /> {/* <-- 2. ДОБАВЛЯЕМ НОВЫЙ МАРШРУТ */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
