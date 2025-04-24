
import { useState, useEffect, useLayoutEffect } from 'react';

// Use a safe version of useLayoutEffect that falls back to useEffect on the server
const useSafeLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const useThemeManager = () => {
  const [currentTheme, setCurrentTheme] = useState<string>('dark');
  const [currentAccent, setCurrentAccent] = useState<string>('purple');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initialize theme on mount
  useSafeLayoutEffect(() => {
    try {
      // Check if there's a saved theme preference, default to dark
      const savedTheme = localStorage.getItem('theme') || 'dark';
      const savedAccent = localStorage.getItem('accent') || 'purple';
      
      setCurrentTheme(savedTheme);
      setCurrentAccent(savedAccent);
      
      // Apply theme to HTML element
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(savedTheme);
        
        // Apply accent color
        document.documentElement.classList.remove('blue', 'green', 'purple', 'red', 'orange', 'yellow', 'pink', 'indigo');
        document.documentElement.classList.add(savedAccent);
        
        // Apply color scheme and body classes
        if (savedTheme === 'dark') {
          document.body.classList.add('dark-scrollbar');
          document.body.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        } else {
          document.body.classList.remove('dark-scrollbar');
          document.body.classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
        }
      }
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error initializing theme:', error);
      // Apply fallback theme if error
      if (typeof document !== 'undefined') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      }
      setIsLoaded(true);
    }
  }, []);

  // Function to set a new theme
  const setTheme = (newTheme: string) => {
    try {
      if (typeof document !== 'undefined') {
        // Remove existing theme classes
        document.documentElement.classList.remove('light', 'dark');
        
        // Add new theme class
        document.documentElement.classList.add(newTheme);
        
        // Update body classes and color scheme
        if (newTheme === 'dark') {
          document.body.classList.add('dark-scrollbar');
          document.body.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        } else {
          document.body.classList.remove('dark-scrollbar');
          document.body.classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
        }
        
        // Save to localStorage
        localStorage.setItem('theme', newTheme);
        
        // Update state
        setCurrentTheme(newTheme);
      }
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  };

  // Function to set a new accent color
  const setAccent = (newAccent: string) => {
    try {
      if (typeof document !== 'undefined') {
        // Remove existing accent classes
        document.documentElement.classList.remove('blue', 'green', 'purple', 'red', 'orange', 'yellow', 'pink', 'indigo');
        
        // Add new accent class
        document.documentElement.classList.add(newAccent);
        
        // Save to localStorage
        localStorage.setItem('accent', newAccent);
        
        // Update state
        setCurrentAccent(newAccent);
      }
    } catch (error) {
      console.error('Error setting accent:', error);
    }
  };

  return {
    theme: currentTheme,
    accent: currentAccent,
    isLoaded,
    setTheme,
    setAccent
  };
};
