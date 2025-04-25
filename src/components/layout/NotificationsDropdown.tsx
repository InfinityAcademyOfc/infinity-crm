
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

interface NotificationEvent {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  path?: string;
  moduleId?: string;
}

// Mock events with routing information
const fetchUpcomingEvents = (): NotificationEvent[] => {
  return [
    {
      id: "1",
      title: "Tarefa: Revisar documento A",
      subtitle: "Kanban · 10 minutos restantes",
      type: "kanban",
      path: "/app/production",
      moduleId: "document-a"
    },
    {
      id: "2",
      title: "Reunião: Equipe de Vendas",
      subtitle: "Reuniões · Em breve",
      type: "meeting",
      path: "/app/meetings"
    },
    {
      id: "3",
      title: "Produção: Planilha Orçamento",
      subtitle: "Produção · 30 minutos restantes",
      type: "production",
      path: "/app/production",
      moduleId: "budget-sheet"
    },
  ];
};

export default function NotificationsDropdown() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<NotificationEvent[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setEvents(fetchUpcomingEvents());
  }, []);

  const handleNotificationClick = (event: NotificationEvent) => {
    setOpen(false);
    if (event.path) {
      navigate(event.path, { state: { moduleId: event.moduleId } });
    }
  };

  const hasNotifications = events.length > 0;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notificações"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {hasNotifications && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="p-3 font-semibold text-base">
          Notificações
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-72 overflow-y-auto">
          {events.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhuma notificação.
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                onClick={() => handleNotificationClick(event)}
                className="flex flex-col gap-1 p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/40"
              >
                <span className="font-medium">{event.title}</span>
                <span className="text-xs text-muted-foreground">{event.subtitle}</span>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
