export const logError = (message: string, error: any, context?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(message, error, context);
  } else {
    // Em produção, você pode integrar com um serviço de monitoramento de erros como Sentry, Bugsnag, etc.
    // Exemplo com um placeholder para Sentry:
    // Sentry.captureException(error, { extra: { message, context } });
    // Ou enviar para um endpoint de API de logs:
    // fetch('/api/log-error', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message, error: error.message, stack: error.stack, context }),
    // });
    console.error(`[PROD ERROR] ${message}`, error, context);
  }
};

export const logInfo = (message: string, context?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'development') {
    console.info(message, context);
  }
};

export const logWarn = (message: string, context?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(message, context);
  }
};


