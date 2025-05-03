
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children?: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Iniciamos a transição
    setIsTransitioning(true);
    
    // Após um curto período, terminamos a transição
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 200); // Reduzido para 200ms para ser mais rápido
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      className={`transition-opacity duration-200 ease-in-out ${
        isTransitioning ? 'opacity-70' : 'opacity-100'
      }`}
      style={{ 
        // Garantimos que a cor de fundo combine com o tema atual
        backgroundColor: 'var(--background)',
      }}
    >
      <div className="animate-fade-in">
        {children}
      </div>
    </div>
  );
};

export default PageTransition;
