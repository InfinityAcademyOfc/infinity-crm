
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useThemeManager, type ThemeType, type AccentType } from "@/hooks/useThemeManager";
import { Check, Moon, Sun } from "lucide-react";

const themes = [
  { name: "Escuro", value: "dark", color: "bg-gray-900", icon: <Moon size={14} className="mr-2" /> },
  { name: "Claro", value: "light", color: "bg-white", icon: <Sun size={14} className="mr-2" /> },
];

const accentColors = [
  { name: "Roxo", value: "purple", color: "bg-purple-500" },
  { name: "Azul", value: "blue", color: "bg-blue-500" },
  { name: "Verde", value: "green", color: "bg-green-500" },
  { name: "Vermelho", value: "red", color: "bg-red-500" },
  { name: "Laranja", value: "orange", color: "bg-orange-500" },
  { name: "Amarelo", value: "yellow", color: "bg-yellow-500" },
  { name: "Rosa", value: "pink", color: "bg-pink-500" },
  { name: "Índigo", value: "indigo", color: "bg-indigo-500" },
];

const ThemeToggle = () => {
  const { isDark, theme, accent, setTheme, setAccent } = useThemeManager();
  const { toast } = useToast();

  const handleThemeChange = (theme: ThemeType) => {
    setTheme(theme);
    
    toast({
      title: "Tema alterado",
      description: `O tema foi alterado para ${themes.find(t => t.value === theme)?.name || theme}`,
    });
  };

  const handleAccentChange = (accent: AccentType) => {
    setAccent(accent);
    
    // Apply the accent color to CSS variables for immediate visual feedback
    const root = document.documentElement;
    root.setAttribute('data-accent', accent);
    
    toast({
      title: "Cor principal alterada",
      description: `A cor principal foi alterada para ${accentColors.find(a => a.value === accent)?.name || accent}`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-foreground"
        >
          <Palette size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background border-border shadow-lg">
        <DropdownMenuLabel>Tema e Personalização</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <div className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
            Tema
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {themes.map((themeOption) => (
              <Button
                key={themeOption.value}
                variant={theme === themeOption.value ? "default" : "outline"}
                size="sm"
                className="w-full justify-center"
                onClick={() => handleThemeChange(themeOption.value as ThemeType)}
              >
                {themeOption.icon}
                {themeOption.name}
              </Button>
            ))}
          </div>
          <div className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
            Cor principal
          </div>
          <div className="grid grid-cols-4 gap-2">
            {accentColors.map((accentOption) => (
              <button 
                key={accentOption.value}
                className={`w-8 h-8 rounded-full ${accentOption.color} border border-gray-300 dark:border-gray-600 cursor-pointer flex items-center justify-center transition-transform hover:scale-110 ${accent === accentOption.value ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground' : ''}`}
                onClick={() => handleAccentChange(accentOption.value as AccentType)}
                type="button"
                aria-label={`Cor ${accentOption.name}`}
              >
                {accent === accentOption.value && (
                  <Check size={14} className="text-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
