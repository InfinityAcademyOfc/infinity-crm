
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
import { useIsMobile } from "@/hooks/use-mobile";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  
  // Automatically close sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Mobile overlay when sidebar is open */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30" 
            onClick={() => setSidebarOpen(false)} 
            aria-hidden="true"
          />
        )}

        {/* Sidebar container */}
        <div 
          className={cn(
            "transition-all duration-300 ease-in-out",
            isMobile ? (
              "fixed top-0 bottom-0 left-0 z-40",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            ) : (
              "relative flex-shrink-0",
              sidebarOpen ? "w-64" : "w-16" // Desktop: minimalist view when closed
            )
          )}
        >
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        </div>

        {/* Main content area - don't move when sidebar opens */}
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <TopNav openSidebar={() => setSidebarOpen(true)} isSidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 overflow-auto">
            <div className="container p-4 md:p-6 px-0">
              <ErrorBoundary>
                <Suspense fallback={<LoadingScreen minimal />}>
                  <Outlet />
                </Suspense>
              </ErrorBoundary>
            </div>
          </main>
        </div>

        {/* Floating collapse button - always visible */}
        <div 
          className={cn(
            "fixed z-50 transition-all duration-300",
            isMobile ? (
              "bottom-28 left-4"
            ) : (
              sidebarOpen ? "left-60 bottom-28" : "left-12 bottom-28"
            )
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
