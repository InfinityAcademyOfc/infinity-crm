
import React, { Suspense } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/ui/loading-screen';

// Skeleton loader for auth-protected content
const AuthLoadingSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        ))}
      </div>
      <div className="h-72 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        ))}
      </div>
    </div>
  </div>
);

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    // Redirect to login page, saving the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected routes
  return (
    <Suspense fallback={<AuthLoadingSkeleton />}>
      <Outlet />
    </Suspense>
  );
};

export default ProtectedRoute;
