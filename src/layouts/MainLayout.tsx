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
import PageTransition from "@/components/ui/page-transition";
import { toast } from "sonner";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { loading, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  // Handle window resize
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

  // Handle route changes
  useEffect(() => {
    if (isMobileView) {
      setSidebarOpen(false);
    }
    setIsLoadingPage(true);
    const timer = setTimeout(() => setIsLoadingPage(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname, isMobileView]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Sidebar - Fixed position with transition */}
        <div 
          className={cn(
            "fixed top-0 left-0 z-30 h-screen transition-all duration-300 ease-in-out",
            sidebarOpen ? "w-64" : "w-0"
          )}
        >
          <Sidebar 
            open={sidebarOpen} 
            setOpen={setSidebarOpen}
          />
        </div>

        {/* Main content wrapper - Shifts with sidebar */}
        <div 
          className={cn(
            "flex flex-col flex-1 min-w-0 h-screen transition-all duration-300 ease-in-out",
            sidebarOpen && !isMobileView ? "ml-64" : "ml-0"
          )}
        >
          {/* TopNav - Shifts with content */}
          <TopNav />
          
          {/* Main scrollable content */}
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
              onError={(error) => {
                console.error("Layout error caught:", error);
                toast.error("Erro na interface", {
                  description: "Um erro foi detectado e está sendo tratado"
                });
              }}
            >
              <PageTransition>
                <Suspense fallback={<LoadingScreen minimal />}>
                  {isLoadingPage ? (
                    <LoadingScreen minimal />
                  ) : (
                    <Outlet />
                  )}
                </Suspense>
              </PageTransition>
            </ErrorBoundary>
          </main>
        </div>

        <UnifiedChatButton />

        {/* Mobile toggle button */}
        {isMobileView && (
          <div 
            className={cn(
              "fixed z-40 transition-all duration-300",
              "bottom-16 left-4"
            )}
          >
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full h-9 w-9 shadow-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(130,80,223,0.4)]"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Fechar Menu" : "Abrir Menu"}
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", !sidebarOpen && "rotate-180")} />
            </Button>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
