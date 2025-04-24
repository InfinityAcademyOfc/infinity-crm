
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = ({ minimal = false }: { minimal?: boolean }) => {
  if (minimal) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[200px]">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-primary/20 blur-xl animate-pulse"></div>
          <Loader2 className="h-8 w-8 animate-spin text-primary relative z-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-primary/20 blur-xl animate-pulse"></div>
        <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
      </div>
      <p className="mt-6 text-lg font-medium">Carregando Infinity CRM...</p>
      <p className="mt-2 text-sm text-muted-foreground">Preparando sua experiência personalizada</p>
      
      <div className="mt-8 w-64 h-1 bg-background rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-progress-bar"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
