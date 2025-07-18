
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import MainLayout from "@/layouts/MainLayout";
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useThemeManager } from '@/hooks/useThemeManager';
import { ErrorBoundary } from '@/components/ui/error-boundary';

// Direct imports for faster loading
import Dashboard from '@/pages/Dashboard';
import SalesFunnel from '@/pages/SalesFunnel';
import ClientManagement from '@/pages/ClientManagement';
import FinanceManagement from '@/pages/FinanceManagement';
import ProductsServices from '@/pages/ProductsServices';
import LeadImport from '@/pages/LeadImport';
import ProductionManagement from '@/pages/ProductionManagement';
import TeamManagement from '@/pages/TeamManagement';
import Meetings from '@/pages/Meetings';
import Settings from '@/pages/Settings';
import UserSettings from '@/pages/UserSettings';
import WhatsAppIntegration from '@/pages/WhatsAppIntegration';
import AdsIntegrationPage from '@/pages/AdsIntegrationPage';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import WaitingArea from '@/pages/WaitingArea';

// Import styles
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

// Optimized query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  }
});

function App() {
  const { isLoaded } = useThemeManager();

  // Remove loading screen for faster startup
  if (!isLoaded) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/waiting" element={<WaitingArea />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<MainLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="sales-funnel" element={<SalesFunnel />} />
                  <Route path="clients" element={<ClientManagement />} />
                  <Route path="finance" element={<FinanceManagement />} />
                  <Route path="products" element={<ProductsServices />} />
                  <Route path="lead-import" element={<LeadImport />} />
                  <Route path="production" element={<ProductionManagement />} />
                  <Route path="team" element={<TeamManagement />} />
                  <Route path="meetings" element={<Meetings />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="user-settings" element={<UserSettings />} />
                  <Route path="whatsapp" element={<WhatsAppIntegration />} />
                  <Route path="ads-integration" element={<AdsIntegrationPage />} />
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
