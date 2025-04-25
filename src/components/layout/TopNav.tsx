import React from "react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { UserMenu } from "@/components/auth/UserMenu";
import NotificationsDropdown from "@/components/layout/NotificationsDropdown";
import { useLocation } from "react-router-dom";

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
export function TopNav() {
  const location = useLocation();
  // Determine best match for path
  const modulePath = Object.keys(moduleData).filter(key => location.pathname.startsWith(key)).sort((a, b) => b.length - a.length)[0];

  // Always set a default object shape, guaranteeing both properties exist
  const moduleInfo = moduleData[modulePath] ? {
    name: moduleData[modulePath].name || "",
    subtitle: moduleData[modulePath].subtitle || ""
  } : {
    name: "",
    subtitle: ""
  };

  // Safe DOM operation with useEffect and checking existence before manipulating
  React.useEffect(() => {
    const headerElement = document.querySelector('header.sticky');
    if (headerElement) {
      try {
        headerElement.classList.add('bg-background/50', 'backdrop-blur', 'supports-[backdrop-filter]:bg-background/50');
      } catch (error) {
        console.error("Error updating header style:", error);
      }
    }
    return () => {
      if (headerElement) {
        try {
          headerElement.classList.remove('bg-background/50', 'backdrop-blur', 'supports-[backdrop-filter]:bg-background/50');
        } catch (error) {
          console.error("Error reverting header style:", error);
        }
      }
    };
  }, []);
  return <header className="sticky top-0 z-50 w-full border-b bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="container flex h-14 items-center">
        {/* Título/subtítulo alinhados à esquerda apenas */}
        <div className="flex flex-col items-start justify-center flex-1 py-0 my-0">
          {moduleInfo.name && <span className="text-md font-bold text-lg">{moduleInfo.name}</span>}
          {moduleInfo.subtitle && <span className="text-muted-foreground text-sm py-0 my-0">{moduleInfo.subtitle}</span>}
        </div>
        <div className="flex items-center gap-2">
          <NotificationsDropdown />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>;
}