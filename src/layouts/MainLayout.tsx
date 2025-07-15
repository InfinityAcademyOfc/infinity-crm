
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/navigation/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import UnifiedChatButton from "@/components/chat/UnifiedChatButton";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/MobileNav";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop Sidebar */}
        {!isMobileView && (
          <div 
            className={cn(
              "transition-all duration-200 ease-in-out relative flex-shrink-0",
              sidebarOpen ? "w-64" : "w-16"
            )}
          >
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          </div>
        )}

        {/* Mobile Navigation */}
        <MobileNav open={mobileOpen} setOpen={setMobileOpen} />

        {/* Main content area */}
        <div className={cn("flex flex-col flex-1 w-full overflow-hidden")}>
          <TopNav 
            openMobileNav={() => setMobileOpen(true)} 
            isMobileView={isMobileView}
          />
          
          <main className="flex-1 overflow-auto">
            <div className="container p-4 md:p-6 px-0">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </div>
          </main>
        </div>

        {/* Floating collapse button - desktop only */}
        {!isMobileView && (
          <div className={cn(
            "fixed z-[51] transition-all duration-200 bottom-28",
            sidebarOpen ? "left-60" : "left-12"
          )}>
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full h-9 w-9 shadow-md bg-primary text-primary-foreground hover:bg-primary/90" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", !sidebarOpen && "rotate-180")} />
            </Button>
          </div>
        )}

        {/* Mobile sidebar toggle */}
        {isMobileView && (
          <div className={cn(
            "fixed z-[51] transition-all duration-200 ease-in-out",
            mobileOpen ? "left-[calc(80%-1.5rem)]" : "left-4",
            "bottom-28"
          )}>
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full h-9 w-9 shadow-md bg-primary text-primary-foreground hover:bg-primary/90" 
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", !mobileOpen && "rotate-180")} />
            </Button>
          </div>
        )}

        <UnifiedChatButton />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
