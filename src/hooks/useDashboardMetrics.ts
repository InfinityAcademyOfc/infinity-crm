
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase';
import { logError } from '@/utils/logger';

interface DashboardMetrics {
  totalLeads: number;
  totalClients: number;
  totalRevenue: number;
  completedTasks: number;
  pendingTasks: number;
  activeFunnelStages: number;
  conversionRate: number;
  monthlyGrowth: number;
  topPerformingSource: string;
}

export const useDashboardMetrics = () => {
  const { user, companyProfile } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalLeads: 0,
    totalClients: 0,
    totalRevenue: 0,
    completedTasks: 0,
    pendingTasks: 0,
    activeFunnelStages: 0,
    conversionRate: 0,
    monthlyGrowth: 0,
    topPerformingSource: 'Direto'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const companyId = useMemo(() => {
    return companyProfile?.company_id || user?.id || '';
  }, [companyProfile, user]);

  useEffect(() => {
    if (!companyId) return;

    const fetchMetrics = async () => {
      const now = Date.now();
      // Cache por 5 minutos
      if (now - lastFetch < 5 * 60 * 1000) return;

      try {
        setIsLoading(true);

        const [
          leadsResult,
          clientsResult,
          transactionsResult,
          tasksResult,
          stagesResult
        ] = await Promise.all([
          supabase.from('leads').select('id, status').eq('company_id', companyId),
          supabase.from('clients').select('id').eq('company_id', companyId),
          supabase.from('financial_transactions').select('amount, type').eq('company_id', companyId),
          supabase.from('tasks').select('id, status').eq('company_id', companyId),
          supabase.from('funnel_stages').select('id').eq('company_id', companyId)
        ]);

        const leads = leadsResult.data || [];
        const clients = clientsResult.data || [];
        const transactions = transactionsResult.data || [];
        const tasks = tasksResult.data || [];
        const stages = stagesResult.data || [];

        const totalRevenue = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const pendingTasks = tasks.filter(t => t.status === 'pending').length;
        
        const convertedLeads = leads.filter(l => l.status === 'converted').length;
        const conversionRate = leads.length > 0 ? Math.round((convertedLeads / leads.length) * 100) : 0;

        setMetrics({
          totalLeads: leads.length,
          totalClients: clients.length,
          totalRevenue,
          completedTasks,
          pendingTasks,
          activeFunnelStages: stages.length,
          conversionRate,
          monthlyGrowth: Math.floor(Math.random() * 15) + 5, // Mock growth
          topPerformingSource: 'Website'
        });

        setLastFetch(now);
      } catch (error) {
        logError('Erro ao carregar métricas do dashboard', error, { 
          component: 'useDashboardMetrics',
          companyId 
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [companyId, lastFetch]);

  return { metrics, isLoading };
};
