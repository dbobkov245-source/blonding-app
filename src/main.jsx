import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';       // <-- Импортируем ВАШ App.jsx с роутером
import './index.css';     // <-- Подключаем ваши стили

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> {/* <-- Теперь здесь рендерится настоящий компонент App */}
  </React.StrictMode>
);
