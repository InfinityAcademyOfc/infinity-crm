
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/navigation/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import UnifiedChatButton from "@/components/chat/UnifiedChatButton";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import CollapseButton from "@/components/common/buttons/CollapseButton";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Mobile overlay when sidebar is open */}
        {isMobileView && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar container */}
        <div 
          className={cn(
            "flex-shrink-0 transition-all duration-300 ease-in-out",
            isMobileView ? "fixed z-40 h-full" : "relative",
            sidebarOpen ? "w-64" : "w-20",
          )}
        >
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        </div>

        {/* Main content area */}
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <TopNav />
          
          <main className="flex-1 overflow-auto">
            <div className="container p-4 md:p-6">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </div>
          </main>
        </div>

        {/* Floating collapse button */}
        <div 
          className={cn(
            "fixed bottom-28 z-50 transition-all duration-300",
            isMobileView ? "left-4" : sidebarOpen ? "left-60" : "left-12"
          )}
        >
          <CollapseButton 
            isCollapsed={!sidebarOpen} 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            position="left"
          />
        </div>

        <UnifiedChatButton />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
