
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, 
  BarChart2, 
  Users, 
  FileText, 
  Settings,
  Package, 
  Calendar, 
  MessageSquare,
  UserPlus,
  X
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/app/dashboard" },
    { icon: BarChart2, label: "Funil de Vendas", path: "/app/sales-funnel" },
    { icon: Users, label: "Clientes", path: "/app/clients" },
    { icon: Package, label: "Produtos", path: "/app/products" },
    { icon: FileText, label: "Financeiro", path: "/app/finance" },
    { icon: Calendar, label: "Reuniões", path: "/app/meetings" },
    { icon: MessageSquare, label: "Comunicação", path: "/app/communication" },
    { icon: UserPlus, label: "Equipe", path: "/app/team" },
    { icon: Settings, label: "Configurações", path: "/app/settings" },
  ];
  
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-background border-r transition-transform md:translate-x-0 duration-300 md:sticky",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between h-14 px-4 border-b">
        <h2 className="text-lg font-semibold">Infinity CRM</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="md:hidden"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                location.pathname === item.path ? "bg-muted" : ""
              )}
              onClick={() => {
                navigate(item.path);
                if (window.innerWidth < 768) {
                  setIsOpen(false);
                }
              }}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
