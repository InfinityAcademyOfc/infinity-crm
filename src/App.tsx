
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Waiting from './pages/Waiting';
import Pricing from './pages/Pricing';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WhatsAppIntegrationPage from './pages/WhatsAppIntegration';
import UnifiedChatButton from './components/chat/UnifiedChatButton';
import { Toaster } from "@/components/ui/toaster";

// Import WhatsAppProvider
import { WhatsAppProvider } from './contexts/WhatsAppContext';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <WhatsAppProvider>
            <QueryClientProvider client={queryClient}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/waiting" element={<Waiting />} />
                <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/whatsapp" element={<ProtectedRoute><WhatsAppIntegrationPage /></ProtectedRoute>} />
                <Route path="/" element={<Navigate to="/app" />} />
              </Routes>
              <Toaster />
            </QueryClientProvider>
          </WhatsAppProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default App;
