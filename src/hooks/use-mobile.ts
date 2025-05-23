
import { useState, useEffect } from 'react';

/**
 * Hook para verificar se o dispositivo está em modo mobile
 * @param breakpoint Tamanho da tela em pixels para considerar como mobile (padrão: 768)
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Inicialização
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Verificar inicialmente
    checkMobile();
    
    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);
  
  return isMobile;
}
