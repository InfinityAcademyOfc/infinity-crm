
import React from 'react';

interface PageTransitionProps {
  children?: React.ReactNode;
}

// Ultra-fast page transitions with CSS-only hardware acceleration
const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <div className="animate-in fade-in-0 duration-75">
      {children}
    </div>
  );
};

export default PageTransition;
