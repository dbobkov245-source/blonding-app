// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Theory from './Theory';
import Quizzes from './Quizzes';

// 'const base = ...' БОЛЬШЕ НЕ НУЖЕН

function App() {
  return (
    // Мы убрали 'basename={base}'
    <BrowserRouter> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/theory/:lessonId" element={<Theory />} />
        <Route path="/quizzes" element={<Quizzes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
