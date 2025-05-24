
import React from "react";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserMenu } from "@/components/auth/UserMenu";
import { useAuth } from "@/contexts/AuthContext";

interface TopNavProps {
  openMobileNav: () => void;
  isMobileView: boolean;
  notificationCount?: number;
}

export const TopNav = ({ openMobileNav, isMobileView, notificationCount = 0 }: TopNavProps) => {
  const { user, company, companyProfile } = useAuth();

  const getDisplayName = () => {
    if (companyProfile) {
      return companyProfile.name;
    }
    if (company) {
      return company.name;
    }
    return user?.email?.split('@')[0] || 'Usuário';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={openMobileNav}
          className="mr-2"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        <div className="flex-1">
          <h1 className="text-lg font-semibold">
            Infinity CRM
          </h1>
          <p className="text-xs text-muted-foreground">
            {getDisplayName()}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </Badge>
            )}
          </Button>
          
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
