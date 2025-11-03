import React from 'react';
// Обратите внимание: мы снова импортируем BrowserRouter, а не Router
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from './Home';
import Theory from './Theory';

// Эта строка автоматически возьмет '/blonding-app/' из vite.config.js
const base = import.meta.env.BASE_URL;

function App() {
  return (
    // Мы передаем 'base' в 'basename' роутера
    <BrowserRouter basename={base}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/theory/:lessonId" element={<Theory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
