
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
        {/* Sidebar container with dynamic width */}
        <div 
          className={cn(
            "flex-shrink-0 transition-all duration-300 ease-in-out relative",
            sidebarOpen ? "w-64" : "w-16",
            isMobileView && !sidebarOpen && "w-0"
          )}
        >
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          
          {/* Collapse button */}
          <div className="absolute -right-4 top-4 z-30">
            <CollapseButton
              isCollapsed={!sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="shadow-lg bg-background border"
              position="right"
              title={sidebarOpen ? "Recolher menu" : "Expandir menu"}
            />
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <TopNav />
          
          <main className="flex-1 overflow-auto">
            <div className="container p-4 md:p-6">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </div>
          </main>
        </div>

        {/* Mobile toggle button - only show when in mobile view */}
        {isMobileView && (
          <button
            className={cn(
              "fixed z-40 bottom-24 transition-all duration-300",
              "rounded-full h-9 w-9 bg-primary text-primary-foreground hover:bg-primary/90",
              "flex items-center justify-center shadow-lg",
              sidebarOpen ? "left-[16.5rem]" : "left-4"
            )}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className={cn("transition-transform", !sidebarOpen && "rotate-180")}>
              {sidebarOpen ? "←" : "→"}
            </span>
          </button>
        )}

        <UnifiedChatButton />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
