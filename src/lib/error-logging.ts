
import { ErrorInfo } from 'react';

// Simple error logging utility for React errors
export const logError = (error: Error, errorInfo?: ErrorInfo) => {
  console.error('Application error:', error);
  
  if (errorInfo) {
    console.error('Component stack:', errorInfo.componentStack);
  }
  
  // In a production app, you would typically send this to a logging service
  // Example: sendToErrorLoggingService(error, errorInfo);
};

// Function to handle unhandled promise rejections
export const setupErrorHandlers = () => {
  if (typeof window !== 'undefined') {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      
      // In a production app, you would typically send this to a logging service
      // Example: sendToErrorLoggingService(event.reason);
    });
    
    // Handle global errors
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      
      // In a production app, you would typically send this to a logging service
      // Example: sendToErrorLoggingService(event.error);
    });
  }
};

// This function logs DOM node removal errors, which can help diagnose issues with
// components being unmounted while they still have active animations or transitions
export const setupDOMErrorTracking = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const originalRemoveChild = Node.prototype.removeChild;
    
    Node.prototype.removeChild = function(child) {
      if (child.parentNode !== this) {
        console.error('Invalid removeChild call - node is not a child of the parent:', {
          parent: this,
          child: child,
          stack: new Error().stack
        });
        return child;
      }
      return originalRemoveChild.call(this, child);
    };
  }
};
