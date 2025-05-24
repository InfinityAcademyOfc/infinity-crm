
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Carregando...</h2>
          <p className="text-sm text-muted-foreground">
            Aguarde enquanto carregamos o sistema
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
