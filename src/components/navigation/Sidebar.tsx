
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { LayoutDashboard, Filter, Users, DollarSign, Package, Upload, ClipboardList, UserCog, Video, Settings, MessageCircle, Zap } from "lucide-react";
import NavSection from "./NavSection";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const mainMenuItems = [
  {
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard",
    to: "/app",
    end: true
  },
  {
    icon: <Filter size={18} />,
    label: "Funil de Vendas",
    to: "/app/sales-funnel"
  },
  {
    icon: <Users size={18} />,
    label: "Clientes",
    to: "/app/clients"
  },
  {
    icon: <DollarSign size={18} />,
    label: "Financeiro",
    to: "/app/finance"
  },
  {
    icon: <Package size={18} />,
    label: "Produtos/Serviços",
    to: "/app/products"
  },
  {
    icon: <Upload size={18} />,
    label: "Importar",
    to: "/app/lead-import"
  }
];

const integrationItems = [
  {
    icon: <MessageCircle size={18} />,
    label: "WhatsApp",
    to: "/app/whatsapp"
  },
  {
    icon: <Zap size={18} />,
    label: "Anúncios",
    to: "/app/ads-integration"
  }
];

const managementItems = [
  {
    icon: <ClipboardList size={18} />,
    label: "Produção",
    to: "/app/production"
  },
  {
    icon: <UserCog size={18} />,
    label: "Equipe",
    to: "/app/team"
  },
  {
    icon: <Video size={18} />,
    label: "Reuniões",
    to: "/app/meetings"
  }
];

const systemItems = [
  {
    icon: <Settings size={18} />,
    label: "Configurações",
    to: "/app/settings"
  }
];

const Sidebar = ({
  open,
  setOpen
}: SidebarProps) => {
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = window.innerWidth < 768;
  
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [location.pathname, isMobile, setOpen]);

  return (
    <div 
      ref={sidebarRef} 
      className={cn(
        "h-full bg-background/95 backdrop-blur-md border-r shadow-lg",
        "flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
        isMobile ? 
          open ? "w-64 translate-x-0" : "w-0 -translate-x-full" 
          : 
          open ? "w-64" : "w-16",
        "dark:bg-gray-900/90 dark:border-gray-800",
        "bg-gradient-to-b from-background/95 to-background/98"
      )}
    >
      <div className="flex-1 overflow-y-auto p-4 py-[30px] pt-14 sidebar-scrollbar">
        <NavSection 
          title="Menu Principal" 
          items={mainMenuItems} 
          isCollapsed={!open} 
          onItemClick={() => isMobile && setOpen(false)} 
        />
        <NavSection 
          title="Integrações" 
          items={integrationItems} 
          isCollapsed={!open} 
          onItemClick={() => isMobile && setOpen(false)}
          className="mt-6" 
        />
        <NavSection 
          title="Gestão" 
          items={managementItems} 
          isCollapsed={!open} 
          onItemClick={() => isMobile && setOpen(false)}
          className="mt-6" 
        />
        <NavSection 
          title="Sistema" 
          items={systemItems} 
          isCollapsed={!open} 
          onItemClick={() => isMobile && setOpen(false)}
          className="mt-6 mb-4" 
        />
      </div>
    </div>
  );
};

export default Sidebar;
