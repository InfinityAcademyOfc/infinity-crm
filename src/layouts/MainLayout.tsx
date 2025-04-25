
import React, { useState, useEffect } from "react";
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
      <div className="flex h-screen w-full bg-background">
        {/* Sidebar */}
        <div
          className={cn(
            "h-full transition-all duration-300 ease-in-out relative",
            sidebarOpen ? "w-64" : "w-16",
            isMobileView && !sidebarOpen && "w-0"
          )}
        >
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
          {/* Top Navigation */}
          <div className="sticky top-0 z-20 w-full">
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
