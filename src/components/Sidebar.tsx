
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  TrendingUp,
  Users,
  UserCheck,
  CheckSquare,
  Calendar,
  Target,
  FileText,
  Settings,
  PieChart,
  MessageSquare,
  DollarSign,
  Folder,
  MessageCircle,
  Upload
} from "lucide-react";
import { NavLink, useLocation } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';

const Sidebar = () => {
  const location = useLocation();
  const session = useSession();

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Leads', path: '/leads' },
    { icon: TrendingUp, label: 'Funil de Vendas', path: '/sales-funnel' },
    { icon: UserCheck, label: 'Clientes', path: '/clients' },
    { icon: CheckSquare, label: 'Tarefas', path: '/tasks' },
    { icon: Calendar, label: 'Reuniões', path: '/meetings' },
    { icon: Target, label: 'Metas', path: '/goals' },
    { icon: FileText, label: 'Produção', path: '/production' },
    { icon: Upload, label: 'Importação', path: '/import' },
    { icon: PieChart, label: 'Relatórios', path: '/reports' },
    { icon: MessageSquare, label: 'WhatsApp', path: '/whatsapp' },
    { icon: DollarSign, label: 'Financeiro', path: '/financial' },
    { icon: Folder, label: 'Documentos', path: '/documents' },
    { icon: MessageCircle, label: 'Comunicação', path: '/internal-communication' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0">
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent className="w-64">
        <ScrollArea className="h-full py-6">
          <div className="px-3 py-2">
            <h2 className="mb-2 mt-2 px-4 text-lg font-semibold tracking-tight">
              {session?.user?.email?.split('@')[0] || 'Usuário'}
            </h2>
            <p className="text-muted-foreground px-4 text-sm">
              {session?.user?.email}
            </p>
          </div>
          <Separator className="my-2" />
          {menuItems.map((item) => (
            <div key={item.label}>
              <NavLink
                to={item.path}
                className={`flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:underline ${location.pathname === item.path ? 'bg-secondary' : ''
                  }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            </div>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
