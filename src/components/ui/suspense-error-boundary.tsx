
import React from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface SuspenseErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

/**
 * Optimized component that renders immediately without Suspense delays
 */
export const SuspenseErrorBoundary = ({
  children,
  fallback = null, // No fallback for immediate rendering
  errorFallback = (
    <div className="p-4 text-red-500 animate-in fade-in-0 duration-100">
      Something went wrong. Please try again later.
    </div>
  ),
}: SuspenseErrorBoundaryProps) => {
  return (
    <ErrorBoundary fallback={errorFallback}>
      {children}
    </ErrorBoundary>
  );
};
