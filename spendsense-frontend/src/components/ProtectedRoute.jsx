import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // 1. Check if the user has a token in local storage
  const isAuthenticated = localStorage.getItem('token');

  // 2. If no token, kick them back to the login page immediately
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. If they have a token, let them access the Dashboard
  return children;
};

export default ProtectedRoute;