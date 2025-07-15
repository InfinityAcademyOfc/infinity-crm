
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children?: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  // Optimized to 25ms for ultra-fast transitions
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 25); // Ultra-fast transition
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      className={`transition-opacity duration-25 ease-in-out ${
        isTransitioning ? 'opacity-95' : 'opacity-100'
      }`}
    >
      {children}
    </div>
  );
};

export default PageTransition;
