//rutas
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Recorrido from './Recorrido';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recorrido" element={<Recorrido />} />
      </Routes>
    </Router>
  );
}

export default App;


