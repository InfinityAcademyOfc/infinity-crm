
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DashboardMetrics {
  totalLeads: number;
  totalClients: number;
  totalTasks: number;
  totalRevenue: number;
  conversionRate: number;
  completedTasks: number;
  pendingTasks: number;
  activeFunnelStages: number;
  monthlyGrowth: number;
  topPerformingSource: string;
}

export const useDashboardMetrics = () => {
  const { company } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalLeads: 0,
    totalClients: 0,
    totalTasks: 0,
    totalRevenue: 0,
    conversionRate: 0,
    completedTasks: 0,
    pendingTasks: 0,
    activeFunnelStages: 0,
    monthlyGrowth: 0,
    topPerformingSource: 'Não disponível'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!company?.id) return;

    const fetchMetrics = async () => {
      try {
        setIsLoading(true);

        // Buscar leads
        const { data: leads } = await supabase
          .from('leads')
          .select('*')
          .eq('company_id', company.id);

        // Buscar clientes
        const { data: clients } = await supabase
          .from('clients')
          .select('*')
          .eq('company_id', company.id);

        // Buscar tarefas
        const { data: tasks } = await supabase
          .from('tasks')
          .select('*')
          .eq('company_id', company.id);

        // Buscar transações financeiras
        const { data: transactions } = await supabase
          .from('financial_transactions')
          .select('*')
          .eq('company_id', company.id)
          .eq('type', 'income');

        // Buscar etapas do funil
        const { data: funnelStages } = await supabase
          .from('funnel_stages')
          .select('*')
          .eq('company_id', company.id);

        // Calcular métricas
        const totalLeads = leads?.length || 0;
        const totalClients = clients?.length || 0;
        const totalTasks = tasks?.length || 0;
        const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0;
        const pendingTasks = tasks?.filter(task => task.status === 'pending').length || 0;
        const totalRevenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
        const conversionRate = totalLeads > 0 ? (totalClients / totalLeads) * 100 : 0;
        const activeFunnelStages = funnelStages?.length || 0;

        // Calcular fonte com melhor performance
        const sourceCount = leads?.reduce((acc: any, lead) => {
          if (lead.source) {
            acc[lead.source] = (acc[lead.source] || 0) + 1;
          }
          return acc;
        }, {});
        const topPerformingSource = sourceCount 
          ? Object.keys(sourceCount).sort((a, b) => sourceCount[b] - sourceCount[a])[0] || 'Não disponível'
          : 'Não disponível';

        // Calcular crescimento mensal (simulado - pode ser refinado)
        const currentMonth = new Date().getMonth();
        const currentMonthLeads = leads?.filter(lead => 
          new Date(lead.created_at).getMonth() === currentMonth
        ).length || 0;
        const lastMonthLeads = leads?.filter(lead => 
          new Date(lead.created_at).getMonth() === currentMonth - 1
        ).length || 0;
        const monthlyGrowth = lastMonthLeads > 0 
          ? ((currentMonthLeads - lastMonthLeads) / lastMonthLeads) * 100 
          : currentMonthLeads > 0 ? 100 : 0;

        setMetrics({
          totalLeads,
          totalClients,
          totalTasks,
          totalRevenue,
          conversionRate: Number(conversionRate.toFixed(1)),
          completedTasks,
          pendingTasks,
          activeFunnelStages,
          monthlyGrowth: Number(monthlyGrowth.toFixed(1)),
          topPerformingSource
        });

      } catch (error) {
        console.error('Erro ao buscar métricas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [company?.id]);

  return { metrics, isLoading };
};
