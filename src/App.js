import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Main from './components/Main';
import Operation from './components/Operation';
import Profile from './components/Profile'; 
import Simulation from './components/Simulations';
import Gestion from './components/gestion';

import './styles.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<Main />} />
        <Route path="/operations" element={<Operation />} />
        <Route path="/profile" element={<Profile />} /> {}
        <Route path="/simulations" element={<Simulation />} />
        <Route path="/gestion" element={<Gestion />} />
        <Route path="/" exact element={<Main />} />
      </Routes>
    </Router>
  );
};

export default App;
