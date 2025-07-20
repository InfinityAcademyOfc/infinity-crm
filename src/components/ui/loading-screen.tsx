
import React from 'react';

// Removed all loading functionality - components now render immediately
const LoadingScreen = ({ children }: { children?: React.ReactNode }) => {
  return <>{children}</>;
};

export default LoadingScreen;
