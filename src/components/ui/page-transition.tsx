
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
    }, 300);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      className={`transition-opacity duration-300 ease-in-out ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className={`animate-fade-in`}>
        {children}
      </div>
    </div>
  );
};

export default PageTransition;
