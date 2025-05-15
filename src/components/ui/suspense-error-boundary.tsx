
import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface SuspenseErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

/**
 * A component that combines Suspense and ErrorBoundary for better error handling
 * in components that might suspend.
 */
export const SuspenseErrorBoundary = ({
  children,
  fallback = <div className="p-4">Loading...</div>,
  errorFallback = (
    <div className="p-4 text-red-500">
      Something went wrong. Please try again later.
    </div>
  ),
}: SuspenseErrorBoundaryProps) => {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};
