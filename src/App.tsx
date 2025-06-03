
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Account from './pages/Account'
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import SalesFunnel from './pages/SalesFunnel';
import Clients from './pages/Clients';
import Tasks from './pages/Tasks';
import Meetings from './pages/Meetings';
import Goals from './pages/Goals';
import ProductionWorkspace from './pages/ProductionWorkspace';
import Settings from './pages/Settings';
import WhatsApp from './pages/WhatsApp';
import Financial from './pages/Financial';
import Documents from './pages/Documents';
import InternalCommunication from './pages/InternalCommunication';
import Sidebar from './components/Sidebar';
import { useAuth } from './contexts/AuthContext';
import Import from './pages/Import';
import Reports from './pages/Reports';

const App = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {session ? (
          <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-4">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/sales-funnel" element={<SalesFunnel />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/meetings" element={<Meetings />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/production" element={<ProductionWorkspace />} />
                <Route path="/import" element={<Import />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/whatsapp" element={<WhatsApp />} />
                <Route path="/financial" element={<Financial />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/internal-communication" element={<InternalCommunication />} />
              </Routes>
            </main>
          </div>
        ) : (
          <div className="container mx-auto py-8">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={['google', 'github']}
              redirectTo={`${window.location.origin}/`}
            />
          </div>
        )}
      </div>
    </Router>
  )
}

export default App
