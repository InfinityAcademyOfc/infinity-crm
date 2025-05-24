
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRealClientData } from './useRealClientData';
import { useRealProducts } from './useRealProducts';
import { useTeamMembers } from './useTeamMembers';
import { useFinancialData } from './useFinancialData';
import { useMeetings } from './useMeetings';
import { useActivities } from './useActivities';
import { useGoals } from './useGoals';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types/lead';
import { Task } from '@/types/task';

export const useRealData = () => {
  const { company } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Use existing hooks
  const { clients, loading: clientsLoading, refetch: refetchClients } = useRealClientData();
  const { products, loading: productsLoading, refetch: refetchProducts } = useRealProducts();
  const { teamMembers, loading: teamLoading, refetch: refetchTeam } = useTeamMembers();
  const { transactions, loading: transactionsLoading, refetch: refetchTransactions } = useFinancialData();
  const { meetings, loading: meetingsLoading, refetch: refetchMeetings } = useMeetings();
  const { activities, loading: activitiesLoading, refetch: refetchActivities } = useActivities();
  const { goals, loading: goalsLoading, refetch: refetchGoals } = useGoals();

  const fetchLeads = async () => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    }
  };

  const fetchTasks = async () => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const refetch = async () => {
    setLoading(true);
    await Promise.all([
      fetchLeads(),
      fetchTasks(),
      refetchClients(),
      refetchProducts(),
      refetchTeam(),
      refetchTransactions(),
      refetchMeetings(),
      refetchActivities(),
      refetchGoals()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    if (company?.id) {
      refetch();
    }
  }, [company]);

  const allLoading = loading || clientsLoading || productsLoading || teamLoading || 
                   transactionsLoading || meetingsLoading || activitiesLoading || goalsLoading;

  return {
    leads,
    clients,
    tasks,
    products,
    meetings,
    teamMembers,
    transactions,
    activities,
    goals,
    loading: allLoading,
    refetch
  };
};
