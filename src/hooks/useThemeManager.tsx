
import { useState, useEffect } from 'react';

export const useThemeManager = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Verificar a preferência do sistema
    const prefersDark = window.matchMedia && 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Verificar o tema armazenado anteriormente, se houver
    const savedTheme = localStorage.getItem('theme');
    
    // Determinar o tema inicial
    const initialIsDark = savedTheme === 'dark' || 
      (savedTheme === null && prefersDark);
    
    setIsDark(initialIsDark);
    
    // Aplicar a classe 'dark' no elemento HTML quando necessário
    if (initialIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Observer para mudanças na preferência do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('theme') === null) {
        setIsDark(e.matches);
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    // Adicionar listener para mudanças na preferência do sistema
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      }
    };
  }, []);
  
  // Função para alternar o tema
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  return { isDark, toggleTheme };
};

export default useThemeManager;
