
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function NotificationsDropdown() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleNotificationClick = (notification: any) => {
    setOpen(false);
    
    // Marcar como lida
    markAsRead(notification.id);
    
    // Navegar para o link se existir
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const hasNotifications = notifications.length > 0;
  const hasUnread = unreadCount > 0;

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
          {hasUnread && (
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-3 flex items-center justify-between font-semibold text-base border-b">
          <DropdownMenuLabel className="p-0">
            Notificações {hasUnread && <span className="ml-1 text-xs text-primary">({unreadCount})</span>}
          </DropdownMenuLabel>
          
          {hasUnread && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs flex gap-1 items-center"
              onClick={() => markAllAsRead()}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        
        <ScrollArea className="max-h-72">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhuma notificação.
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                  "flex items-start gap-3 p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/40",
                  notification.read ? "opacity-75" : "bg-primary/5"
                )}
              >
                <div className={cn(
                  "w-2 h-2 rounded-full mt-2",
                  notification.read ? "bg-muted-foreground/40" : "bg-primary"
                )} />
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className={cn(
                      "font-medium",
                      !notification.read && "text-primary"
                    )}>
                      {notification.title}
                    </span>
                    
                    {notification.read ? (
                      <span className="text-xs text-muted-foreground ml-2">
                        <Check className="h-3 w-3" />
                      </span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  
                  <div className="text-xs text-muted-foreground mt-2">
                    {new Date(notification.created_at).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
