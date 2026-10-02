import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const dashboardMap = { admin: '/admin', owner: '/owner', user: '/stores' };
    return <Navigate to={dashboardMap[user.role] || '/stores'} replace />;
  }
  return children;
}
