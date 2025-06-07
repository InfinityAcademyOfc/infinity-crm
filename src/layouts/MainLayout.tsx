import React, { useState, useEffect, Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/navigation/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import UnifiedChatButton from "@/components/chat/UnifiedChatButton";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import LoadingScreen from "@/components/ui/loading-screen";
import { MobileNav } from "@/components/layout/MobileNav";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize(); // Call on initial render

    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);
  
  useEffect(() => {
    if (isMobileView) {
      setSidebarOpen(false);
      setMobileOpen(false);
    }
  }, [location.pathname, isMobileView]);
  
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop Sidebar */}
        {!isMobileView && (
          <div className={cn("transition-all duration-300 ease-in-out relative flex-shrink-0", sidebarOpen ? "w-64" : "w-16")}>
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          </div>
        )}

        {/* Mobile Navigation */}
        <MobileNav isOpen={mobileOpen} setIsOpen={setMobileOpen} />

        {/* Main content area */}
        <div className={cn("flex flex-col flex-1 w-full overflow-hidden")}>
          <TopNav openMobileNav={() => setMobileOpen(true)} isMobileView={isMobileView} />
          
          <main className="flex-1 overflow-auto">
            <div className="container p-4 md:p-6 mx-0">
              <ErrorBoundary 
                fallback={
                  <div className="p-6 bg-destructive/10 rounded-lg">
                    <h2 className="text-xl font-bold text-destructive mb-2">
                      Algo deu errado
                    </h2>
                    <p className="mb-4">
                      Ocorreu um erro ao renderizar este componente.
                    </p>
                    <div className="flex gap-4">
                      <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="flex items-center">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Voltar
                      </Button>
                      <Button onClick={() => window.location.reload()} size="sm" variant="default">
                        Tentar novamente
                      </Button>
                    </div>
                  </div>
                }
              >
                <Suspense fallback={<LoadingScreen minimal />}>
                  <Outlet />
                </Suspense>
              </ErrorBoundary>
            </div>
          </main>
        </div>

        {/* Floating collapse button - desktop only */}
        {!isMobileView && (
          <div className={cn("fixed z-[51] transition-all duration-300 bottom-28", sidebarOpen ? "left-60" : "left-12")}>
            <Button 
              variant="default"
              size="icon"
              className="rounded-full h-9 w-9 shadow-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(130,80,223,0.4)]"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", !sidebarOpen && "rotate-180")} />
            </Button>
          </div>
        )}

        {/* Mobile sidebar toggle - visible only on mobile */}
        {isMobileView && (
          <div className={cn("fixed z-[51] transition-all duration-300 ease-in-out", mobileOpen ? "left-[calc(80%-1.5rem)]" : "left-4", "bottom-28")}>
            <Button 
              variant="default"
              size="icon"
              className="rounded-full h-9 w-9 shadow-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(130,80,223,0.4)]"
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
