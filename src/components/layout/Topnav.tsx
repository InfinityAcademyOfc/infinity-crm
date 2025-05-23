
import React from "react";
import { Bell, Menu, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface TopnavProps {
  toggleSidebar: () => void;
  notificationCount: number;
}

const Topnav = ({ toggleSidebar, notificationCount }: TopnavProps) => {
  const { profile } = useAuth();
  
  const getInitials = () => {
    if (!profile?.name) return "U";
    
    const nameParts = profile.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  };
  
  return (
    <header className="h-14 border-b flex items-center px-4 sticky top-0 bg-background/95 backdrop-blur z-10">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar}
        className="md:hidden"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      
      <div className="flex-1" />
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center text-xs bg-primary text-primary-foreground rounded-full">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
        >
          <Settings className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile?.avatar || ""} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Topnav;
