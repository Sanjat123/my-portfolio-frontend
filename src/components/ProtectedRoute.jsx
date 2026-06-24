import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  
  // Agar token nahi mila, login par bhej do
  return token ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;