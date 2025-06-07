
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TopNav } from "@/components/layout/TopNav";
import Sidebar from "@/components/navigation/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAuth } from "@/contexts/AuthContext";
import FloatingChat from "@/components/chat/FloatingChat";
import { supabase } from "@/lib/supabase";
import { useNotifications } from "@/hooks/useNotifications";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, profile, company } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar open={isSidebarOpen} setOpen={setIsSidebarOpen} />

      <div className="flex flex-col flex-1">
        <TopNav 
          openMobileNav={() => setIsSidebarOpen(!isSidebarOpen)} 
          isMobileView={false}
          notificationCount={unreadCount}
        />
        
        <MobileNav isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        <div className="flex-1 p-4 md:p-6 pb-16">
          <Outlet />
        </div>
        
        {/* Chat flutuante disponível em todo o app */}
        {user && <FloatingChat />}
      </div>

      <Toaster />
    </div>
  );
};

export default MainLayout;
