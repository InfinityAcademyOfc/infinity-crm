import React, { useState, useEffect, Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/navigation/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import UnifiedChatButton from "@/components/chat/UnifiedChatButton";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import LoadingScreen from "@/components/ui/loading-screen";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { loading } = useAuth();
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
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  useEffect(() => {
    if (isMobileView) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobileView]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <div className="h-screen flex-shrink-0 overflow-hidden">
          <Sidebar 
            open={sidebarOpen} 
            setOpen={setSidebarOpen}
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(-1)}
                      className="flex items-center"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Voltar
                    </Button>
                    <Button
                      onClick={() => window.location.reload()}
                      size="sm"
                      variant="default"
                    >
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
          </main>
        </div>

        {isMobileView && (
          <div 
            className={cn(
              "fixed z-40 transition-all duration-300",
              sidebarOpen ? "left-[16.5rem]" : "left-4",
              "bottom-24"
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
        )}
        
        <UnifiedChatButton />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
