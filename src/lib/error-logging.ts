
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
    });
    
    // Handle global errors
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
    });
  }
};

// Safely query DOM elements with proper error handling
export const safeQuerySelector = <T extends Element>(
  selector: string, 
  parent: Document | Element = document
): T | null => {
  try {
    return parent.querySelector<T>(selector);
  } catch (error) {
    console.error(`Error querying selector "${selector}":`, error);
    return null;
  }
};

// Safely modify DOM elements with proper checks
export const safeModifyElement = (
  element: Element | null | undefined,
  modifier: (el: Element) => void
): boolean => {
  if (element) {
    try {
      modifier(element);
      return true;
    } catch (error) {
      console.error('Error modifying DOM element:', error);
      return false;
    }
  }
  return false;
};

// Safe DOM node removal with proper checks
export const safeRemoveChild = (parent: Node | null, child: Node | null): boolean => {
  if (!parent || !child) return false;
  
  try {
    if (child.parentNode === parent) {
      parent.removeChild(child);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error removing child node:', error);
    return false;
  }
};

// This function logs DOM node removal errors, which can help diagnose issues with
// components being unmounted while they still have active animations or transitions
export const setupDOMErrorTracking = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const originalRemoveChild = Node.prototype.removeChild;
    
    Node.prototype.removeChild = function(child) {
      if (!child) {
        console.error('Invalid removeChild call - child is null or undefined');
        return child;
      }
      
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
