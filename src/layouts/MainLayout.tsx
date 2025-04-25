
import React, { useState, useEffect, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/navigation/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import LoadingScreen from "@/components/ui/loading-screen";
import UnifiedChatButton from "@/components/chat/UnifiedChatButton";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

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

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar 
          open={sidebarOpen} 
          setOpen={setSidebarOpen}
        />

        <div className={cn(
          "flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out",
          sidebarOpen ? "md:ml-64" : "md:ml-16",
          isMobileView ? "ml-0" : ""
        )}>
          <div className="sticky top-0 z-50 w-full">
            <TopNav />
          </div>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <ErrorBoundary>
              <Suspense fallback={<LoadingScreen minimal />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>

        {isMobileView && (
          <button 
            className={cn(
              "fixed z-40 transition-all duration-300",
              sidebarOpen ? "left-[16.5rem]" : "left-4",
              "bottom-24"
            )}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className={cn(
              "h-4 w-4 transition-transform",
              !sidebarOpen && "rotate-180"
            )}>
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
