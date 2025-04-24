
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { setupErrorHandlers, setupDOMErrorTracking, logError } from '@/lib/error-logging'

// Base styles
import './styles/base.css'
import './styles/theme.css'
import './styles/scrollbars.css'

// Component specific styles
import './styles/cards.css'
import './styles/kanban.css'
import './styles/navigation.css'
import './styles/animations.css'
import './styles/tags.css'
import './styles/whatsapp.css'
import './styles/radix-overrides.css'

// Responsive utilities
import './styles/responsive.css'

// Setup global error handlers
setupErrorHandlers();

// Track DOM errors in development mode
if (process.env.NODE_ENV === 'development') {
  setupDOMErrorTracking();
}

// Root error fallback
const RootErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Algo deu errado</h1>
      <p className="mb-4">A aplicação encontrou um erro inesperado.</p>
      <pre className="bg-gray-200 dark:bg-gray-800 p-4 rounded mb-4 max-w-lg overflow-auto text-sm">
        {error.toString()}
      </pre>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={resetErrorBoundary}
      >
        Recarregar a página
      </button>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  // StrictMode temporarily disabled for debugging
  <ErrorBoundary 
    fallback={<RootErrorFallback error={new Error('Application failed to render')} resetErrorBoundary={() => window.location.reload()} />}
    onError={logError}
  >
    <App />
  </ErrorBoundary>
)
