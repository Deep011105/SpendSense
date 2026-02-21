import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios'; 
import { Toaster } from 'react-hot-toast'; // <--- 1. IMPORT TOASTER

import Hero from './components/Hero'; 
import Dashboard from './components/Dashboard'; 
import LandingPage from './components/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';

// --- GLOBAL AXIOS INTERCEPTOR ---
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  return (
    <Router>
      {/* 2. ADD THE TOASTER HERE SO IT IS TRULY GLOBAL */}
      <Toaster 
        position="top-right"
        toastOptions={{
          // Force success toasts to disappear after 3 seconds (3000ms)
          duration: 3000, 
          style: {
            background: '#18181b', 
            color: '#fff',
            borderRadius: '12px',
          },
          // You can even specifically target success/error durations
          success: {
            duration: 3000,
          },
        }}
      />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;