
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
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "h-full transition-all duration-300 ease-in-out",
          "bg-background border-r border-border/40",
          isMobileView && !sidebarOpen
            ? "hidden"
            : sidebarOpen
            ? "w-64"
            : "w-16"
        )}
      >
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </aside>

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* TopNav fixo que acompanha a Sidebar */}
        <div className="sticky top-0 z-20 w-full">
          <TopNav />
        </div>

        {/* Conteúdo scrollável */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>

    {/* Botão flutuante para mobile */}
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
  </SidebarProvider>
);
};

export default MainLayout;
