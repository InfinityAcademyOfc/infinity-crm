
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = ({ minimal = false }: { minimal?: boolean }) => {
  if (minimal) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[200px]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default LoadingScreen;
