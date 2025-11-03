import React from "react";
import ReactDOM from "react-dom/client";

// Простой компонент
function App() {
  return <h1>Привет, Blonding App работает!</h1>;
}

// Этот код запускает всё "в корень" — div#root из index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
