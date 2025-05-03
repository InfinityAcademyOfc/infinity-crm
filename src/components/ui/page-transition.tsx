
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children?: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 150); // Reduced to 150ms for faster transitions
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      className={`transition-all duration-150 ease-in-out ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {children}
    </div>
  );
};

export default PageTransition;
