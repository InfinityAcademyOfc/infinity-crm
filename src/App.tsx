
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
import MainLayout from "./layouts/MainLayout";

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';
import WaitingArea from './pages/WaitingArea';
import Pricing from './pages/Pricing';

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
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/waiting" element={<WaitingArea />} />

                  {/* Protected routes with MainLayout */}
                  <Route path="/" element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                      <Route index element={<Navigate to="/app" replace />} />
                      
                      {/* App routes */}
                      <Route path="app" element={<Dashboard />} />
                      <Route path="app/dashboard" element={<Dashboard />} />
                      <Route path="app/sales-funnel" element={<SalesFunnel />} />
                      <Route path="app/clients" element={<ClientManagement />} />
                      <Route path="app/finance" element={<FinanceManagement />} />
                      <Route path="app/products" element={<ProductsServices />} />
                      <Route path="app/lead-import" element={<LeadImport />} />
                      
                      {/* Integration routes */}
                      <Route path="app/whatsapp" element={<WhatsAppIntegrationPage />} />
                      <Route path="app/ads-integration" element={<AdsIntegrationPage />} />
                      
                      {/* Management routes */}
                      <Route path="app/production" element={<ProductionManagement />} />
                      <Route path="app/team" element={<TeamManagement />} />
                      <Route path="app/meetings" element={<Meetings />} />
                      
                      {/* Settings */}
                      <Route path="app/settings" element={<Settings />} />
                    </Route>
                  </Route>

                  {/* Catch all - redirect to app */}
                  <Route path="*" element={<Navigate to="/app" replace />} />
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
