import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Você pode logar o erro para um serviço de monitoramento aqui
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Algo deu errado.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


