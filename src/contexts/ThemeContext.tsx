
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Get initial theme from localStorage or default to system
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    return savedTheme || "system";
  });
  
  const { user } = useAuth();
  
  // Apply theme function
  const applyTheme = (newTheme: Theme) => {
    document.documentElement.classList.remove("light", "dark");
    
    if (newTheme === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.add(systemPrefersDark ? "dark" : "light");
    } else {
      document.documentElement.classList.add(newTheme);
    }
    
    localStorage.setItem("theme", newTheme);
  };
  
  // Set theme function (updates state and applies theme)
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    
    // If user is logged in, save to database
    if (user) {
      try {
        const { data: existingSettings } = await supabase
          .from("user_settings")
          .select("id")
          .eq("user_id", user.id)
          .single();
        
        if (existingSettings) {
          await supabase
            .from("user_settings")
            .update({ theme: newTheme })
            .eq("user_id", user.id);
        } else {
          await supabase
            .from("user_settings")
            .insert({
              user_id: user.id,
              theme: newTheme,
              notifications_enabled: true,
              language: "pt-BR"
            });
        }
      } catch (error) {
        console.error("Failed to save theme preference:", error);
      }
    }
  };
  
  // Load theme from database when user changes
  useEffect(() => {
    if (!user) return;
    
    const loadThemePreference = async () => {
      try {
        const { data, error } = await supabase
          .from("user_settings")
          .select("theme")
          .eq("user_id", user.id)
          .single();
        
        if (error) {
          if (error.code !== "PGRST116") { // No rows found
            throw error;
          }
          // Use default/localStorage theme if no user preference found
        } else if (data && data.theme) {
          setThemeState(data.theme as Theme);
          applyTheme(data.theme as Theme);
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      }
    };
    
    loadThemePreference();
  }, [user]);
  
  // Listen for system theme changes if using system theme
  useEffect(() => {
    if (theme !== "system") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);
  
  // Apply theme on initial render
  useEffect(() => {
    applyTheme(theme);
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
};
