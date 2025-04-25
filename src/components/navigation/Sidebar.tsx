
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
    // Handle clicking outside the sidebar to close it on mobile
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

  if (!open) return null;

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black/30 z-20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}
      
      <div className="h-screen fixed top-0 left-0 z-30" ref={sidebarRef}>
        <aside
          className={cn(
            "sidebar border-r border-gray-200 dark:border-gray-800 h-full transition-all duration-300 relative flex flex-col",
            isCollapsed ? "min-w-16 w-16" : "min-w-64 w-64",
            isMobile ? "fixed inset-y-0 left-0 z-20 shadow-lg" : "relative"
          )}
        >
          {isMobile && (
            <div className="flex justify-end p-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setOpen(false)}
                aria-label="Close Sidebar"
              >
                <X size={18} />
              </Button>
            </div>
          )}

          <div className="flex-grow overflow-y-auto px-4 py-0">
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
        </aside>
      </div>
      
      {/* Single toggle button outside of sidebar */}
      <div 
        className={cn(
          "fixed z-40 transition-all duration-300",
          open ? (isCollapsed ? "left-[4.5rem]" : "left-[16.5rem]") : "left-4",
          "top-[calc(100vh-7rem)]"
        )}
      >
        <Button 
          variant="default" 
          size="icon" 
          className="rounded-full h-9 w-9 shadow-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(130,80,223,0.4)]"
          onClick={toggleCollapse}
          aria-label={open ? "Recolher Menu" : "Expandir Menu"}
        >
          {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </Button>
      </div>
    </>
  );
};

export default Sidebar;
