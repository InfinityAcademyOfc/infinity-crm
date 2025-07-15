
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = ({ minimal = false }: { minimal?: boolean }) => {
  if (minimal) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[100px]">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
};

export default LoadingScreen;
