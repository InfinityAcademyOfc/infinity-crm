
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/auth/UserMenu";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";

const moduleNames: Record<string, string> = {
  "/app": "Dashboard",
  "/app/sales-funnel": "Funil de Vendas",
  "/app/clients": "Clientes",
  "/app/finance": "Financeiro",
  "/app/products": "Produtos/Serviços",
  "/app/lead-import": "Importação de Leads",
  "/app/whatsapp": "Integração WhatsApp",
  "/app/ads-integration": "Integração de Anúncios",
  "/app/production": "Gestão de Produção",
  "/app/team": "Gestão de Equipe",
  "/app/meetings": "Reuniões",
  "/app/settings": "Configurações"
};

export interface HeaderProps {
  openSidebar: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header = ({ openSidebar, isSidebarOpen, toggleSidebar }: HeaderProps) => {
  const location = useLocation();
  const [moduleName, setModuleName] = useState("");
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Find the most specific path match
    const currentPath = Object.keys(moduleNames)
      .filter(path => location.pathname.startsWith(path))
      .sort((a, b) => b.length - a.length)[0];
    
    setModuleName(currentPath ? moduleNames[currentPath] : "");
  }, [location]);
  
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          )}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{moduleName}</h1>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
          </Button>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
