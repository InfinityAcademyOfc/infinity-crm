
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Immediate rendering without loading screens
  if (!loading && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render immediately, even if still loading
  return <Outlet />;
};

export default ProtectedRoute;
