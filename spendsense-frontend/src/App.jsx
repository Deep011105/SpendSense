import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero'; 
import Dashboard from './components/Dashboard'; 
import LandingPage from './components/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    // This <Router> tag is what prevents that exact error!
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;