
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package,
  Upload,
  MessageSquare,
  Target,
  FolderOpen,
  UserCheck,
  Calendar,
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/app/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Funil de Vendas',
    href: '/app/sales-funnel',
    icon: TrendingUp,
  },
  {
    title: 'Clientes',
    href: '/app/clients',
    icon: Users,
  },
  {
    title: 'Financeiro',
    href: '/app/finance',
    icon: DollarSign,
  },
  {
    title: 'Produtos/Serviços',
    href: '/app/products',
    icon: Package,
  },
  {
    title: 'Importar Leads',
    href: '/app/lead-import',
    icon: Upload,
  },
];

const integrationItems = [
  {
    title: 'WhatsApp',
    href: '/app/whatsapp',
    icon: MessageSquare,
  },
  {
    title: 'Anúncios',
    href: '/app/ads-integration',
    icon: Target,
  },
];

const managementItems = [
  {
    title: 'Produção',
    href: '/app/production',
    icon: FolderOpen,
  },
  {
    title: 'Equipe',
    href: '/app/team',
    icon: UserCheck,
  },
  {
    title: 'Reuniões',
    href: '/app/meetings',
    icon: Calendar,
  },
];

export const Sidebar = ({ open, onOpenChange }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 bg-card border-r transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-14 items-center justify-between px-4 border-b">
            <Link to="/app" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">∞</span>
              </div>
              <span className="font-semibold">Infinity CRM</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <div className="space-y-6">
              {/* Main Navigation */}
              <div>
                <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Principal
                </h3>
                <div className="space-y-1">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => onOpenChange(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Integrations */}
              <div>
                <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Integrações
                </h3>
                <div className="space-y-1">
                  {integrationItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => onOpenChange(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Management */}
              <div>
                <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Gestão
                </h3>
                <div className="space-y-1">
                  {managementItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => onOpenChange(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-3">
            <Link
              to="/app/settings"
              onClick={() => onOpenChange(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors w-full",
                location.pathname === '/app/settings'
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Settings className="h-4 w-4" />
              Configurações
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
