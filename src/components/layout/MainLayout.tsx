
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Topnav from "@/components/layout/Topnav";
import Sidebar from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAuth } from "@/contexts/AuthContext";
import FloatingChat from "@/components/chat/FloatingChat";
import { supabase } from "@/lib/supabase";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, profile, company } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  // Atualizar contagem de notificações
  useEffect(() => {
    if (!user) return;
    
    const fetchNotificationCount = async () => {
      try {
        // Usar um contador simples já que a tabela notifications pode ainda não existir
        setNotificationCount(0);
      } catch (error) {
        console.error("Erro ao buscar contagem de notificações:", error);
      }
    };
    
    fetchNotificationCount();
    
  }, [user]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex flex-col flex-1">
        <Topnav 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          notificationCount={notificationCount}
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
