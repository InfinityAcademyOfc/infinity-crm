
import { useEffect, lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import MainLayout from "@/layouts/MainLayout";
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LoadingScreen from '@/components/ui/loading-screen';
import { useThemeManager } from '@/hooks/useThemeManager';

// Import custom animations
import '@/styles/animations.css';

// Lazy-loaded components with proper error handling
// Use a consistent pattern that will return a proper default export
const Dashboard = lazy(() => 
  import('@/pages/Dashboard')
    .then(module => ({ default: module.default }))
    .catch(() => {
      console.error('Failed to load Dashboard component');
      return { default: () => <div>Error loading Dashboard</div> };
    })
);

// Apply the same pattern to all lazy-loaded components
const SalesFunnel = lazy(() => 
  import('@/pages/SalesFunnel')
    .then(module => ({ default: module.default }))
);

const ClientManagement = lazy(() => 
  import('@/pages/ClientManagement')
    .then(module => ({ default: module.default }))
);

const FinanceManagement = lazy(() => 
  import('@/pages/FinanceManagement')
    .then(module => ({ default: module.default }))
);

const ProductsServices = lazy(() => 
  import('@/pages/ProductsServices')
    .then(module => ({ default: module.default }))
);

const LeadImport = lazy(() => 
  import('@/pages/LeadImport')
    .then(module => ({ default: module.default }))
);

const ProductionManagement = lazy(() => 
  import('@/pages/ProductionManagement')
    .then(module => ({ default: module.default }))
);

const TeamManagement = lazy(() => 
  import('@/pages/TeamManagement')
    .then(module => ({ default: module.default }))
);

const Meetings = lazy(() => 
  import('@/pages/Meetings')
    .then(module => ({ default: module.default }))
);

const Settings = lazy(() => 
  import('@/pages/Settings')
    .then(module => ({ default: module.default }))
);

const UserSettings = lazy(() => 
  import('@/pages/UserSettings')
    .then(module => ({ default: module.default }))
);

const WhatsAppIntegration = lazy(() => 
  import('@/pages/WhatsAppIntegration')
    .then(module => ({ default: module.default }))
);

const AdsIntegrationPage = lazy(() => 
  import('@/pages/AdsIntegrationPage')
    .then(module => ({ default: module.default }))
);

const Index = lazy(() => 
  import('@/pages/Index')
    .then(module => ({ default: module.default }))
);

const Login = lazy(() => 
  import('@/pages/Login')
    .then(module => ({ default: module.default }))
);

const Register = lazy(() => 
  import('@/pages/Register')
    .then(module => ({ default: module.default }))
);

const NotFound = lazy(() => 
  import('@/pages/NotFound')
    .then(module => ({ default: module.default }))
);

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

const App = () => {
  // Use our theme manager hook
  const { isLoaded } = useThemeManager();

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <Routes>
              <Route path="/" element={
                <Suspense fallback={<LoadingScreen />}>
                  <Index />
                </Suspense>
              } />
              <Route path="/login" element={
                <Suspense fallback={<LoadingScreen />}>
                  <Login />
                </Suspense>
              } />
              <Route path="/register" element={
                <Suspense fallback={<LoadingScreen />}>
                  <Register />
                </Suspense>
              } />
              
              {/* Protected routes that require authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<MainLayout />}>
                  <Route index element={
                    <Suspense fallback={<LoadingScreen />}>
                      <Dashboard />
                    </Suspense>
                  } />
                  <Route path="sales-funnel" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <SalesFunnel />
                    </Suspense>
                  } />
                  <Route path="clients" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <ClientManagement />
                    </Suspense>
                  } />
                  <Route path="finance" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <FinanceManagement />
                    </Suspense>
                  } />
                  <Route path="products" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <ProductsServices />
                    </Suspense>
                  } />
                  <Route path="lead-import" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <LeadImport />
                    </Suspense>
                  } />
                  <Route path="production" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <ProductionManagement />
                    </Suspense>
                  } />
                  <Route path="team" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <TeamManagement />
                    </Suspense>
                  } />
                  <Route path="meetings" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <Meetings />
                    </Suspense>
                  } />
                  <Route path="settings" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <Settings />
                    </Suspense>
                  } />
                  <Route path="user-settings" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <UserSettings />
                    </Suspense>
                  } />
                  <Route path="whatsapp" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <WhatsAppIntegration />
                    </Suspense>
                  } />
                  <Route path="ads-integration" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <AdsIntegrationPage />
                    </Suspense>
                  } />
                </Route>
              </Route>
              
              <Route path="*" element={
                <Suspense fallback={<LoadingScreen />}>
                  <NotFound />
                </Suspense>
              } />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
