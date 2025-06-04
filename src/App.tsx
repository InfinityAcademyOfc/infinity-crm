
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "./components/ui/theme-provider";
import { AuthProvider } from './contexts/AuthContext';
import { WhatsAppSessionProvider } from './contexts/WhatsAppSessionContext';
import { WhatsAppProvider } from './contexts/WhatsAppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';
import WaitingArea from './pages/WaitingArea';
import Pricing from './pages/Pricing';
import Index from './pages/Index';

// App pages
import Dashboard from './pages/Dashboard';
import SalesFunnel from './pages/SalesFunnel';
import ClientManagement from './pages/ClientManagement';
import FinanceManagement from './pages/FinanceManagement';
import ProductsServices from './pages/ProductsServices';
import LeadImport from './pages/LeadImport';
import WhatsAppIntegrationPage from './pages/WhatsAppIntegration';
import AdsIntegrationPage from './pages/AdsIntegrationPage';
import ProductionManagement from './pages/ProductionManagement';
import TeamManagement from './pages/TeamManagement';
import Meetings from './pages/Meetings';
import Settings from './pages/Settings';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <WhatsAppSessionProvider>
            <WhatsAppProvider>
              <QueryClientProvider client={queryClient}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/waiting" element={<WaitingArea />} />

                  {/* Protected routes with MainLayout */}
                  <Route path="/app" element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="sales-funnel" element={<SalesFunnel />} />
                      <Route path="clients" element={<ClientManagement />} />
                      <Route path="finance" element={<FinanceManagement />} />
                      <Route path="products" element={<ProductsServices />} />
                      <Route path="lead-import" element={<LeadImport />} />
                      
                      {/* Integration routes */}
                      <Route path="whatsapp" element={<WhatsAppIntegrationPage />} />
                      <Route path="ads-integration" element={<AdsIntegrationPage />} />
                      
                      {/* Management routes */}
                      <Route path="production" element={<ProductionManagement />} />
                      <Route path="team" element={<TeamManagement />} />
                      <Route path="meetings" element={<Meetings />} />
                      
                      {/* Settings */}
                      <Route path="settings" element={<Settings />} />
                    </Route>
                  </Route>

                  {/* Catch all - redirect to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                <Toaster />
                <SonnerToaster position="top-right" />
              </QueryClientProvider>
            </WhatsAppProvider>
          </WhatsAppSessionProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
