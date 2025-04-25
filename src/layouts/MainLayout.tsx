
import React, { useState, useEffect, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/navigation/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import UnifiedChatButton from "@/components/chat/UnifiedChatButton";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/ui/loading-screen";

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
    handleResize(); // Call on initial render
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
            "transition-all duration-300 ease-in-out",
            isMobileView 
              ? "fixed top-0 bottom-0 z-50" // Mobile: fixed position, high z-index (above TopNav)
              : "relative flex-shrink-0", // Desktop: always visible
            sidebarOpen 
              ? "w-64" 
              : isMobileView 
                ? "w-0 -translate-x-full" // Mobile: completely hidden when closed
                : "w-16" // Desktop: minimalist view when closed
          )}
        >
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        </div>

        {/* Main content area */}
        <div className={cn(
          "flex flex-col flex-1 w-full overflow-hidden"
        )}>
          <TopNav />
          
          <main className="flex-1 overflow-auto">
            <div className="container p-4 md:p-6">
              <ErrorBoundary>
                <Suspense fallback={<LoadingScreen minimal />}>
                  <Outlet />
                </Suspense>
              </ErrorBoundary>
            </div>
          </main>
        </div>

        {/* Floating collapse button - moves with sidebar in mobile */}
        <div 
          className={cn(
            "fixed z-[51] transition-all duration-300", // z-index higher than sidebar
            isMobileView
              ? sidebarOpen 
                ? "left-[15.5rem] bottom-28" // Position when sidebar is open on mobile
                : "left-4 bottom-28" // Position when sidebar is closed on mobile
              : sidebarOpen 
                ? "left-60 bottom-28" // Position when sidebar is open on desktop
                : "left-12 bottom-28" // Position when sidebar is minimized on desktop
          )}
        >
          <Button 
            variant="default" 
            size="icon" 
            className="rounded-full h-9 w-9 shadow-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(130,80,223,0.4)]"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", !sidebarOpen && "rotate-180")} />
          </Button>
        </div>

        <UnifiedChatButton />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
