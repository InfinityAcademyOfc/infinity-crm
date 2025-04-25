
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
    handleResize(); // Initialize on component mount
    
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  return (
    <SidebarProvider>
      <div className={cn(
        "flex h-screen overflow-hidden bg-background relative",
        isMobileView ? "mobile-view" : ""
      )}>
        {/* Mobile overlay that appears when sidebar is open */}
        {isMobileView && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar container with dynamic positioning */}
        <div 
          className={cn(
            "transition-transform duration-300 ease-in-out h-full z-30",
            isMobileView 
              ? "fixed top-0 bottom-0 left-0" 
              : "relative flex-shrink-0",
            sidebarOpen 
              ? "translate-x-0"
              : isMobileView ? "-translate-x-full" : ""
          )}
          style={{
            width: sidebarOpen ? "16rem" : isMobileView ? "16rem" : "0"
          }}
        >
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        </div>

        {/* Main content area with dynamic width */}
        <div 
          className={cn(
            "flex flex-col flex-1 w-full transition-all duration-300 ease-in-out",
            !isMobileView && sidebarOpen ? "ml-64" : "ml-0"
          )}
        >
          {/* TopNav always at the top of the content area */}
          <TopNav />
          
          {/* Main content with scrolling */}
          <main className="flex-1 overflow-auto">
            <div className="container p-4 md:p-6">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </div>
          </main>
        </div>

        {/* Floating collapse button - repositioned to bottom left */}
        <div 
          className={cn(
            "fixed z-40 bottom-20 transition-all duration-300 ease-in-out",
            sidebarOpen 
              ? isMobileView ? "left-[16rem]" : "left-64" 
              : "left-4"
          )}
        >
          <CollapseButton 
            isCollapsed={!sidebarOpen} 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="shadow-md bg-primary text-white hover:bg-primary/90 
                      size-10 rounded-full shadow-[0_0_15px_rgba(130,80,223,0.4)]" 
            position="right" 
            title={sidebarOpen ? "Recolher menu" : "Expandir menu"} 
          />
        </div>

        <UnifiedChatButton />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
