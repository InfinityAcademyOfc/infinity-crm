
interface LogContext {
  component?: string;
  userId?: string;
  timestamp?: string;
  [key: string]: any;
}

export const logError = (message: string, error: any, context?: LogContext) => {
  const timestamp = new Date().toISOString();
  const logData = {
    message,
    error: error?.message || error,
    stack: error?.stack,
    timestamp,
    ...context
  };
  
  console.error('[ERROR]', logData);
  
  // Em produção, aqui enviaria para um serviço de logging
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implementar envio para serviço de logging externo
  }
};

export const logWarning = (message: string, context?: LogContext) => {
  const timestamp = new Date().toISOString();
  console.warn('[WARNING]', message, { timestamp, ...context });
};

export const logInfo = (message: string, context?: LogContext) => {
  const timestamp = new Date().toISOString();
  console.info('[INFO]', message, { timestamp, ...context });
};
