
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingPage } from '@/components/ui/loading-spinner';
import { SectionHeader } from '@/components/ui/section-header';
import RealStatsSection from '@/components/dashboard/RealStatsSection';
import RealActivitiesSection from '@/components/dashboard/RealActivitiesSection';
import { IntegratedFunnel } from '@/components/dashboard/IntegratedFunnel';
import { FinanceChart } from '@/components/dashboard/FinanceChart';
import { WelcomeCard } from '@/components/dashboard/WelcomeCard';

const Dashboard = () => {
  const { user, company, loading } = useAuth();

  if (loading) {
    return <LoadingPage message="Carregando dashboard..." />;
  }

  if (!user || !company) {
    return <LoadingPage message="Verificando autenticação..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <WelcomeCard />
      
      <SectionHeader 
        title="Visão Geral" 
        description="Acompanhe os principais indicadores do seu negócio"
      />
      
      <RealStatsSection />
      
      <div className="grid gap-6 md:grid-cols-2">
        <RealActivitiesSection />
        
        <div className="space-y-6">
          <IntegratedFunnel />
          <FinanceChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
