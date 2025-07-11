import React, { ErrorInfo, ReactNode } from 'react';
import { logError } from '@/utils/logger'; // Importar o logger

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logError("Error caught by ErrorBoundary:", error, { component: "ErrorBoundary", errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-destructive mb-4">Algo deu errado</h2>
          <p className="text-muted-foreground mb-4">
            Ocorreu um erro ao renderizar este componente.
          </p>
          <pre className="bg-muted p-4 rounded-md w-full overflow-auto text-xs mb-4 max-h-48">
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
          >
            Tentar novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simplified FallbackComponent type for use with ErrorBoundary
export type FallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold text-destructive mb-4">Algo deu errado</h2>
      <p className="text-muted-foreground mb-4">
        Ocorreu um erro ao renderizar este componente.
      </p>
      <pre className="bg-muted p-4 rounded-md w-full overflow-auto text-xs mb-4 max-h-48">
        {error.toString()}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
      >
        Tentar novamente
      </button>
    </div>
  );
};

export default ErrorBoundary;


