
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = ({ minimal = false }: { minimal?: boolean }) => {
  if (minimal) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[200px]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="mt-2 text-sm text-muted-foreground">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-6 text-lg font-medium">Carregando Infinity CRM...</p>
      <p className="mt-2 text-sm text-muted-foreground">Preparando sua experiência personalizada</p>
      
      <div className="mt-8 w-64 h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-progress-indeterminate"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
