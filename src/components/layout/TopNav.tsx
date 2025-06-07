
import React from "react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { UserMenu } from "@/components/auth/UserMenu";
import NotificationsDropdown from "@/components/layout/NotificationsDropdown";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

// Module name data with optional subtitle
const moduleData: Record<string, {
  name: string;
  subtitle?: string;
}> = {
  "/app": {
    name: "Dashboard",
    subtitle: "Visão geral do sistema"
  },
  "/app/sales-funnel": {
    name: "Funil de Vendas",
    subtitle: "Acompanhe o andamento de seus leads"
  },
  "/app/clients": {
    name: "Clientes",
    subtitle: "Gestão dos seus clientes"
  },
  "/app/finance": {
    name: "Financeiro",
    subtitle: "Controle financeiro e de receitas"
  },
  "/app/products": {
    name: "Produtos/Serviços",
    subtitle: "Gerencie seus produtos e serviços"
  },
  "/app/lead-import": {
    name: "Importação de Leads",
    subtitle: "Importe e organize leads rapidamente"
  },
  "/app/whatsapp": {
    name: "Integração WhatsApp",
    subtitle: "Sincronize suas conversas de vendas"
  },
  "/app/ads-integration": {
    name: "Integração de Anúncios",
    subtitle: "Conecte seus anúncios facilmente"
  },
  "/app/production": {
    name: "Gestão de Produção",
    subtitle: "Monitore documentos e planilhas"
  },
  "/app/team": {
    name: "Gestão de Equipe",
    subtitle: "Coordene sua equipe"
  },
  "/app/meetings": {
    name: "Reuniões",
    subtitle: "Agende e acompanhe reuniões"
  },
  "/app/settings": {
    name: "Configurações",
    subtitle: "Personalize seu sistema"
  }
};

interface TopNavProps {
  openMobileNav?: () => void;
  isMobileView?: boolean;
  notificationCount?: number;
}

export function TopNav({
  openMobileNav,
  isMobileView = false,
  notificationCount = 0
}: TopNavProps) {
  const location = useLocation();

  // Determine best match for path
  const modulePath = Object.keys(moduleData)
    .filter(key => location.pathname.startsWith(key))
    .sort((a, b) => b.length - a.length)[0];
  
  const moduleInfo = moduleData[modulePath] || {
    name: "",
    subtitle: ""
  };
  
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="container flex h-14 items-center px-[10px]">
        {isMobileView && (
          <Button
            variant="ghost"
            size="icon"
            onClick={openMobileNav}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        )}
        <div className="flex flex-col items-start justify-center flex-1 py-1">
          {moduleInfo.name && <span className="text-sm font-bold">{moduleInfo.name}</span>}
          {moduleInfo.subtitle && <span className="text-muted-foreground text-xs font-normal">{moduleInfo.subtitle}</span>}
        </div>
        <div className="flex items-center gap-2">
          <NotificationsDropdown />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
