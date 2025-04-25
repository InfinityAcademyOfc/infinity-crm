
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
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Mobile overlay */}
        {isMobileView && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar container */}
        <div 
          className={cn(
            "transition-all duration-300 ease-in-out",
            isMobileView 
              ? "fixed top-0 bottom-0 z-50" // Mobile: fixed position, high z-index
              : "relative flex-shrink-0", // Desktop: always visible
            sidebarOpen 
              ? "w-64" 
              : isMobileView 
                ? "w-0" // Mobile: completely hidden when closed
                : "w-16" // Desktop: minimalist view when closed
          )}
        >
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        </div>

        {/* Main content area */}
        <div className={cn(
          "flex flex-col flex-1 w-full overflow-hidden",
          !isMobileView && "ml-0" // Remove margin on mobile
        )}>
          <TopNav />
          
          <main className="flex-1 overflow-auto">
            <div className="container p-4 md:p-6">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </div>
          </main>
        </div>

        {/* Floating collapse button - moves with sidebar in mobile */}
        <div 
          className={cn(
            "fixed bottom-28 z-[51] transition-all duration-300", // z-index higher than sidebar
            isMobileView
              ? sidebarOpen 
                ? "left-[15.5rem]" // Position when sidebar is open on mobile
                : "left-4" // Position when sidebar is closed on mobile
              : sidebarOpen 
                ? "left-60" // Position when sidebar is open on desktop
                : "left-12" // Position when sidebar is minimized on desktop
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
