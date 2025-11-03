import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Theory from './Theory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/theory/:lessonId" element={<Theory />} />
      </Routes>
    </Router>
  );
}

export default App;
