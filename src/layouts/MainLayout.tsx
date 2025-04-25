
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/navigation/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import UnifiedChatButton from "@/components/chat/UnifiedChatButton";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        {/* Sidebar Container */}
        <div 
          className={cn(
            "h-full transition-all duration-300 ease-in-out z-20",
            isSidebarOpen ? "w-64" : "w-0 md:w-16",
            "fixed md:relative"
          )}
        >
          <div className={cn(
            "h-full bg-background border-r",
            !isSidebarOpen && isMobileView && "hidden"
          )}>
            <Sidebar open={isSidebarOpen} setOpen={setIsSidebarOpen} />
          </div>
        </div>

        {/* Main Content Area */}
        <div 
          className={cn(
            "flex-1 flex flex-col min-h-0 transition-all duration-300 ease-in-out",
            isSidebarOpen ? "md:ml-64" : "ml-0 md:ml-16"
          )}
        >
          {/* Top Navigation */}
          <div className="sticky top-0 z-10">
            <TopNav />
          </div>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>

        {/* Mobile Toggle Button */}
        {isMobileView && (
          <button
            className={cn(
              "fixed z-40 bottom-24 transition-all duration-300",
              "rounded-full h-9 w-9 bg-primary text-white shadow-md",
              isSidebarOpen ? "left-[16.5rem]" : "left-4"
            )}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <span className={cn(
              "block transition-transform",
              !isSidebarOpen && "rotate-180"
            )}>
              {isSidebarOpen ? "←" : "→"}
            </span>
          </button>
        )}

        <UnifiedChatButton />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
