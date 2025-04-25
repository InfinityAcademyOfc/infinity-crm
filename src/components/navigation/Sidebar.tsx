
import { useState, useEffect, useRef } from "react";
import { 
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard, 
  Filter, 
  Users, 
  DollarSign, 
  Package, 
  Upload, 
  ClipboardList, 
  UserCog, 
  Video, 
  Settings,
  MessageCircle,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import NavSection from "./NavSection";

const mainMenuItems = [
  { icon: <LayoutDashboard size={18} />, label: "Dashboard", to: "/app", end: true },
  { icon: <Filter size={18} />, label: "Funil de Vendas", to: "/app/sales-funnel" },
  { icon: <Users size={18} />, label: "Clientes", to: "/app/clients" },
  { icon: <DollarSign size={18} />, label: "Financeiro", to: "/app/finance" },
  { icon: <Package size={18} />, label: "Produtos/Serviços", to: "/app/products" },
  { icon: <Upload size={18} />, label: "Importar", to: "/app/lead-import" },
];

const integrationItems = [
  { icon: <MessageCircle size={18} />, label: "WhatsApp", to: "/app/whatsapp" },
  { icon: <Zap size={18} />, label: "Anúncios", to: "/app/ads-integration" },
];

const managementItems = [
  { icon: <ClipboardList size={18} />, label: "Produção", to: "/app/production" },
  { icon: <UserCog size={18} />, label: "Equipe", to: "/app/team" },
  { icon: <Video size={18} />, label: "Reuniões", to: "/app/meetings" },
];

const systemItems = [
  { icon: <Settings size={18} />, label: "Configurações", to: "/app/settings" },
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const isCollapsed = !isMobile && collapsed && open;
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile && !open) {
      setOpen(true);
      setCollapsed(false);
    }
  }, [isMobile, open, setOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && open && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (isMobile && open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, open, setOpen]);

  const toggleCollapse = () => {
    if (isMobile) {
      setOpen(!open);
    } else {
      setCollapsed(!collapsed);
    }
  };

  if (!open && isMobile) return null;

  return (
    <div className="h-full w-full flex flex-col" ref={sidebarRef}>
      {isMobile && (
        <div className="flex justify-end p-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setOpen(false)}
          >
            <X size={18} />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      )}
      
      <div className="flex-grow overflow-y-auto px-4 py-2">
        <NavSection 
          title="Menu Principal" 
          items={mainMenuItems} 
          isCollapsed={isCollapsed}
          onItemClick={() => isMobile && setOpen(false)}
        />
        <NavSection 
          title="Integrações" 
          items={integrationItems} 
          isCollapsed={isCollapsed}
          onItemClick={() => isMobile && setOpen(false)}
          className="mt-6"
        />
        <NavSection 
          title="Gestão" 
          items={managementItems} 
          isCollapsed={isCollapsed}
          onItemClick={() => isMobile && setOpen(false)}
          className="mt-6"
        />
        <NavSection 
          title="Sistema" 
          items={systemItems} 
          isCollapsed={isCollapsed}
          onItemClick={() => isMobile && setOpen(false)}
          className="mt-6 mb-4"
        />
      </div>
      
      {!isMobile && open && (
        <div className="flex items-center justify-center py-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-full h-8 w-8"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
