
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import NavSection from "@/components/navigation/NavSection";
import {
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

interface MobileNavProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Navigation sections data
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

export function MobileNav({ open, setOpen }: MobileNavProps) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-background border-r border-border h-full overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Menu</h3>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
        
        <div className="space-y-6">
          <NavSection 
            title="Menu Principal" 
            items={mainMenuItems} 
            isCollapsed={false}
            onItemClick={() => setOpen(false)}
          />
          
          <NavSection 
            title="Integrações" 
            items={integrationItems} 
            isCollapsed={false}
            onItemClick={() => setOpen(false)}
          />
          
          <NavSection 
            title="Gestão" 
            items={managementItems} 
            isCollapsed={false}
            onItemClick={() => setOpen(false)}
          />
          
          <NavSection 
            title="Sistema" 
            items={systemItems} 
            isCollapsed={false}
            onItemClick={() => setOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
