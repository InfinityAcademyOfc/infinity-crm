
import React, { useEffect, lazy, Suspense, startTransition } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import MainLayout from "@/layouts/MainLayout";
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LoadingScreen from '@/components/ui/loading-screen';
import { useThemeManager } from '@/hooks/useThemeManager';
import PageTransition from '@/components/ui/page-transition';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { logError } from '@/utils/logger';

// Import custom animations
import "./styles/theme.css";
import "./styles/animations.css";
import "./styles/base.css";
import "./styles/cards.css";
import "./styles/navigation.css";
import "./styles/responsive.css";
import "./styles/scrollbars.css";
import "./styles/org-chart.css";
import "./styles/tags.css";
import "./styles/whatsapp.css";
import "./styles/kanban.css";
import "./styles/dashboard.css";

// Lazy-loaded components com error handling melhorado
const Dashboard = lazy(() => 
  import('@/pages/Dashboard')
    .then(module => ({ default: module.default }))
    .catch((error) => {
      logError('Failed to load Dashboard component', error, { component: 'Dashboard' });
      return { default: () => <div>Error loading Dashboard</div> };
    })
);

const SalesFunnel = lazy(() => 
  import('@/pages/SalesFunnel')
    .then(module => ({ default: module.default }))
    .catch((error) => {
      logError('Failed to load SalesFunnel component', error, { component: 'SalesFunnel' });
      return { default: () => <div>Error loading Sales Funnel</div> };
    })
);

const ClientManagement = lazy(() => 
  import('@/pages/ClientManagement')
    .then(module => ({ default: module.default }))
    .catch((error) => {
      logError('Failed to load ClientManagement component', error, { component: 'ClientManagement' });
      return { default: () => <div>Error loading Client Management</div> };
    })
);

const FinanceManagement = lazy(() => 
  import('@/pages/FinanceManagement')
    .then(module => ({ default: module.default }))
    .catch((error) => {
      logError('Failed to load FinanceManagement component', error, { component: 'FinanceManagement' });
      return { default: () => <div>Error loading Finance Management</div> };
    })
);

const ProductsServices = lazy(() => 
  import('@/pages/ProductsServices')
    .then(module => ({ default: module.default }))
    .catch((error) => {
      logError('Failed to load ProductsServices component', error, { component: 'ProductsServices' });
      return { default: () => <div>Error loading Products and Services</div> };
    })
);

const LeadImport = lazy(() => 
  import('@/pages/LeadImport')
    .then(module => ({ default: module.default }))
    .catch((error) => {
      logError('Failed to load LeadImport component', error, { component: 'LeadImport' });
      return { default: () => <div>Error loading Lead Import</div> };
    })
);

const ProductionManagement = lazy(() => 
  import('@/pages/ProductionManagement')
    .then(module => ({ default: module.default }))
    .catch((error) => {
      logError('Failed to load ProductionManagement component', error, { component: 'ProductionManagement' });
      return { default: () => <div>Error loading Production Management</div> };
    })
);

const TeamManagement = lazy(() => 
  import('@/pages/TeamManagement')
    .then(module => ({ default: module.default }))
    .catch((error) => {
      logError('Failed to load TeamManagement component', error, { component: 'TeamManagement' });
      return { default: () => <div>Error loading Team Management</div> };
    })
);

const Meetings = lazy(() => 
  import('@/pages/Meetings')
    .then(module => ({ default: module.default }))
    .catch((error) => {
      logError('Failed to load Meetings component', error, { component: 'Meetings' });
      return { default: () => <div>Error loading Meetings</div> };
    })
);

const Settings = lazy(() => 
  import('@/pages/Settings')
    .then(module => ({ default: module.default }))
    .catch((error) => {
      logError('Failed to load Settings component', error, { component: 'Settings' });
      return { default: () => <div>Error loading Settings</div> };
    })
);

const UserSettings = lazy(() => 
  import('@/pages/UserSettings')
    .then(module => ({ default: module.default }))
    .catch((error) => {
      logError('Failed to load UserSettings component', error, { component: 'UserSettings' });
      return { default: () => <div>Error loading User Settings</div> };
    })
);

const WhatsAppIntegration = lazy(() => 
  import('@/pages/WhatsAppIntegration')
    .then(module => ({ default: module.default }))
    .catch((error) => {
      logError('Failed to load WhatsAppIntegration component', error, { component: 'WhatsAppIntegration' });
      return { default: () => <div>Error loading WhatsApp Integration</div> };
    })
);

const AdsIntegrationPage = lazy(() => 
  import('@/pages/AdsIntegrationPage')
    .then(module => ({ default: module.default }))
    .catch((error) => {
      logError('Failed to load AdsIntegrationPage component', error, { component: 'AdsIntegrationPage' });
      return { default: () => <div>Error loading Ads Integration Page</div> };
    })
);

const Index = lazy(() => 
  import('@/pages/Index')
    .then(module => ({ default: module.default }))
    .catch((error) => {
      logError('Failed to load Index component', error, { component: 'Index' });
      return { default: () => <div>Error loading Index Page</div> };
    })
);

const Login = lazy(() => 
  import('@/pages/Login')
    .then(module => ({ default: module.default }))
    .catch((error) => {
      logError('Failed to load Login component', error, { component: 'Login' });
      return { default: () => <div>Error loading Login Page</div> };
    })
);

const Register = lazy(() => 
  import('@/pages/Register')
    .then(module => ({ default: module.default }))
    .catch((error) => {
      logError('Failed to load Register component', error, { component: 'Register' });
      return { default: () => <div>Error loading Register Page</div> };
    })
);

const NotFound = lazy(() => 
  import('@/pages/NotFound')
    .then(module => ({ default: module.default }))
    .catch((error) => {
      logError('Failed to load NotFound component', error, { component: 'NotFound' });
      return { default: () => <div>Error loading Not Found Page</div> };
    })
);

const WaitingArea = lazy(() => 
  import('@/pages/WaitingArea')
    .then(module => ({ default: module.default }))
    .catch((error) => {
      logError('Failed to load WaitingArea component', error, { component: 'WaitingArea' });
      return { default: () => <div>Error loading Waiting Area</div> };
    })
);

// Custom route change handler for animations
const RouteChangeHandler = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
};

// Configure query client with better caching and retry logic
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false, // Disable refetch on window focus for better performance
      refetchOnReconnect: true,
    }
  }
});

function App() {
  // Use our theme manager hook
  const { isLoaded } = useThemeManager();

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  const handleNavigation = (callback: () => void) => {
    startTransition(() => {
      callback();
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <RouteChangeHandler />
          <Toaster />
          <Sonner />
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <ErrorBoundary fallback={<div>Erro ao carregar a página inicial.</div>}>
                  <Suspense fallback={<LoadingScreen />}>
                    <Index />
                  </Suspense>
                </ErrorBoundary>
              } />
              <Route path="/login" element={
                <ErrorBoundary fallback={<div>Erro ao carregar a página de Login.</div>}>
                  <Suspense fallback={<LoadingScreen />}>
                    <Login />
                  </Suspense>
                </ErrorBoundary>
              } />
              <Route path="/register" element={
                <ErrorBoundary fallback={<div>Erro ao carregar a página de Registro.</div>}>
                  <Suspense fallback={<LoadingScreen />}>
                    <Register />
                  </Suspense>
                </ErrorBoundary>
              } />
              <Route path="/waiting" element={
                <ErrorBoundary fallback={<div>Erro ao carregar a Área de Espera.</div>}>
                  <Suspense fallback={<LoadingScreen />}>
                    <WaitingArea />
                  </Suspense>
                </ErrorBoundary>
              } />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<MainLayout />}>
                  <Route index element={
                    <ErrorBoundary fallback={<div>Erro ao carregar o Dashboard.</div>}>
                      <Suspense fallback={<LoadingScreen minimal />}>
                        <Dashboard />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                  <Route path="sales-funnel" element={
                    <ErrorBoundary fallback={<div>Erro ao carregar o Funil de Vendas.</div>}>
                      <Suspense fallback={<LoadingScreen minimal />}>
                        <SalesFunnel />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                  <Route path="clients" element={
                    <ErrorBoundary fallback={<div>Erro ao carregar o Gerenciamento de Clientes.</div>}>
                      <Suspense fallback={<LoadingScreen />}>
                        <ClientManagement />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                  <Route path="finance" element={
                    <ErrorBoundary fallback={<div>Erro ao carregar o Gerenciamento Financeiro.</div>}>
                      <Suspense fallback={<LoadingScreen />}>
                        <FinanceManagement />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                  <Route path="products" element={
                    <ErrorBoundary fallback={<div>Erro ao carregar Produtos e Serviços.</div>}>
                      <Suspense fallback={<LoadingScreen />}>
                        <ProductsServices />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                  <Route path="lead-import" element={
                    <ErrorBoundary fallback={<div>Erro ao carregar a Importação de Leads.</div>}>
                      <Suspense fallback={<LoadingScreen />}>
                        <LeadImport />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                  <Route path="production" element={
                    <ErrorBoundary fallback={<div>Erro ao carregar o Gerenciamento de Produção.</div>}>
                      <Suspense fallback={<LoadingScreen />}>
                        <ProductionManagement />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                  <Route path="team" element={
                    <ErrorBoundary fallback={<div>Erro ao carregar o Gerenciamento de Equipe.</div>}>
                      <Suspense fallback={<LoadingScreen />}>
                        <TeamManagement />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                  <Route path="meetings" element={
                    <ErrorBoundary fallback={<div>Erro ao carregar Reuniões.</div>}>
                      <Suspense fallback={<LoadingScreen />}>
                        <Meetings />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                  <Route path="settings" element={
                    <ErrorBoundary fallback={<div>Erro ao carregar Configurações.</div>}>
                      <Suspense fallback={<LoadingScreen />}>
                        <Settings />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                  <Route path="user-settings" element={
                    <ErrorBoundary fallback={<div>Erro ao carregar Configurações do Usuário.</div>}>
                      <Suspense fallback={<LoadingScreen />}>
                        <UserSettings />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                  <Route path="whatsapp" element={
                    <ErrorBoundary fallback={<div>Erro ao carregar a Integração WhatsApp.</div>}>
                      <Suspense fallback={<LoadingScreen />}>
                        <WhatsAppIntegration />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                  <Route path="ads-integration" element={
                    <ErrorBoundary fallback={<div>Erro ao carregar a Página de Integração de Anúncios.</div>}>
                      <Suspense fallback={<LoadingScreen />}>
                        <AdsIntegrationPage />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                </Route>
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
