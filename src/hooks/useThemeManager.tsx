
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export type ThemeType = 'dark' | 'light';
export type AccentType = 'purple' | 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'pink' | 'indigo';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  theme: ThemeType;
  accent: AccentType;
  setTheme: (theme: ThemeType) => void;
  setAccent: (accent: AccentType) => void;
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeManager = () => {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setThemeState] = useState<ThemeType>('light');
  const [accent, setAccentState] = useState<AccentType>('blue');

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
    
    setIsDark(initialIsDark);
    setThemeState(initialIsDark ? 'dark' : 'light');
    setAccentState(savedAccent || 'blue');
    
    // Aplicar a classe 'dark' no elemento HTML quando necessário
    if (initialIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Aplicar a classe de cor de destaque
    if (savedAccent) {
      document.documentElement.setAttribute('data-accent', savedAccent);
    } else {
      document.documentElement.setAttribute('data-accent', 'blue');
    }
    
    // Observer para mudanças na preferência do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('theme') === null) {
        const newIsDark = e.matches;
        setIsDark(newIsDark);
        setThemeState(newIsDark ? 'dark' : 'light');
        if (newIsDark) {
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
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  // Função para definir o tema diretamente
  const setTheme = (newTheme: ThemeType) => {
    const newIsDark = newTheme === 'dark';
    setIsDark(newIsDark);
    setThemeState(newTheme);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);
  };
  
  // Função para definir a cor de destaque
  const setAccent = (newAccent: AccentType) => {
    setAccentState(newAccent);
    localStorage.setItem('accent', newAccent);
    
    // Aplicar classes CSS ou atributos de dados personalizados para o tema de cores
    document.documentElement.setAttribute('data-accent', newAccent);
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

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const themeContext = useThemeManager();
  
  return (
    <ThemeContext.Provider value={themeContext}>
      {themeContext.isLoaded ? children : null}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default useThemeManager;
