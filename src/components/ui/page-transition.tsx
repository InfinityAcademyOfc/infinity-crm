
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Start loading
    setIsLoading(true);
    
    // Create a timer that will hide the loader after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Short timeout to avoid flash for fast loads
    
    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-primary/10 z-50">
      <div className="h-full bg-primary animate-[loading_1s_ease-in-out_infinite]"></div>
    </div>
  );
};

export default PageTransition;

// Add this to styles/animations.css:
// @keyframes loading {
//   0% {
//     width: 0%;
//     margin-left: 0;
//   }
//   50% {
//     width: 50%;
//     margin-left: 25%;
//   }
//   100% {
//     width: 100%;
//     margin-left: 100%;
//   }
// }
