
import { useState, useEffect } from 'react';

export type ThemeType = 'dark' | 'light';
export type AccentType = 'purple' | 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'pink' | 'indigo';

export const useThemeManager = () => {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setThemeState] = useState<ThemeType>('light');
  const [accent, setAccentState] = useState<AccentType>('blue');

  // Apply the theme and accent color to the document
  const applyThemeToDOM = (isDark: boolean, accentColor: AccentType) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply accent color
    document.documentElement.setAttribute('data-accent', accentColor);
    
    // Use CSS variables to make color changes immediately visible
    const root = document.documentElement.style;
    
    // We could set specific CSS variables here if needed
    // For now, the data-accent attribute handles this through the theme.css
  };

  useEffect(() => {
    // Verificar a preferência do sistema
    const prefersDark = window.matchMedia && 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Verificar o tema armazenado anteriormente, se houver
    const savedTheme = localStorage.getItem('theme') as ThemeType | null;
    const savedAccent = localStorage.getItem('accent') as AccentType | null;
    
    // Determinar o tema inicial
    const initialIsDark = savedTheme === 'dark' || 
      (savedTheme === null && prefersDark);
    
    const initialAccent = savedAccent || 'blue';
    
    setIsDark(initialIsDark);
    setThemeState(initialIsDark ? 'dark' : 'light');
    setAccentState(initialAccent);
    
    // Apply the theme and accent color
    applyThemeToDOM(initialIsDark, initialAccent);
    
    // Observer para mudanças na preferência do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('theme') === null) {
        const newIsDark = e.matches;
        setIsDark(newIsDark);
        setThemeState(newIsDark ? 'dark' : 'light');
        applyThemeToDOM(newIsDark, initialAccent);
      }
    };
    
    // Adicionar listener para mudanças na preferência do sistema
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    }
    
    setIsLoaded(true);
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      }
    };
  }, []);
  
  // Função para alternar o tema
  const toggleTheme = () => {
    const newIsDark = !isDark;
    const newTheme = newIsDark ? 'dark' : 'light';
    
    setIsDark(newIsDark);
    setThemeState(newTheme);
    
    applyThemeToDOM(newIsDark, accent);
    localStorage.setItem('theme', newTheme);
  };
  
  // Função para definir o tema diretamente
  const setTheme = (newTheme: ThemeType) => {
    const newIsDark = newTheme === 'dark';
    setIsDark(newIsDark);
    setThemeState(newTheme);
    
    applyThemeToDOM(newIsDark, accent);
    localStorage.setItem('theme', newTheme);
  };
  
  // Função para definir a cor de destaque
  const setAccent = (newAccent: AccentType) => {
    setAccentState(newAccent);
    localStorage.setItem('accent', newAccent);
    
    applyThemeToDOM(isDark, newAccent);
  };
  
  return { 
    isDark, 
    toggleTheme, 
    theme,
    accent, 
    setTheme, 
    setAccent,
    isLoaded
  };
};

export default useThemeManager;
