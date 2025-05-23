
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  BarChart2,
  Users,
  Package,
  FileText,
  Calendar,
  MessageSquare,
  UserPlus,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const MobileNav = ({ isOpen, setIsOpen }: MobileNavProps) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/app/dashboard" },
    { icon: BarChart2, label: "Funil", path: "/app/sales-funnel" },
    { icon: Users, label: "Clientes", path: "/app/clients" },
    { icon: Package, label: "Produtos", path: "/app/products" },
    { icon: FileText, label: "Financeiro", path: "/app/finance" },
  ];
  
  const secondaryItems = [
    { icon: Calendar, label: "Reuniões", path: "/app/meetings" },
    { icon: MessageSquare, label: "Chat", path: "/app/communication" },
    { icon: UserPlus, label: "Equipe", path: "/app/team" },
    { icon: Settings, label: "Config", path: "/app/settings" },
  ];
  
  if (!isOpen) return null;
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
  
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-background border-t z-50 md:hidden",
    )}>
      <div className="grid grid-cols-5 p-2">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center py-2 h-auto gap-1"
            onClick={() => handleNavigation(item.path)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
