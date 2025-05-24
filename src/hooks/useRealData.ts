
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRealClientData } from './useRealClientData';
import { useRealProducts } from './useRealProducts';
import { useTeamMembers } from './useTeamMembers';
import { useFinancialData } from './useFinancialData';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/types/lead';
import { Task } from '@/types/task';

export const useRealData = () => {
  const { company } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Use existing hooks
  const { clients, loading: clientsLoading, refetch: refetchClients } = useRealClientData();
  const { products, loading: productsLoading, refetch: refetchProducts } = useRealProducts();
  const { teamMembers, loading: teamLoading, refetch: refetchTeam } = useTeamMembers();
  const { transactions, loading: transactionsLoading, refetch: refetchTransactions } = useFinancialData();

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

  const fetchMeetings = async () => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('company_id', company.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setMeetings(data || []);
    } catch (error) {
      console.error('Erro ao buscar reuniões:', error);
    }
  };

  const refetch = async () => {
    setLoading(true);
    await Promise.all([
      fetchLeads(),
      fetchTasks(),
      fetchMeetings(),
      refetchClients(),
      refetchProducts(),
      refetchTeam(),
      refetchTransactions()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    if (company?.id) {
      refetch();
    }
  }, [company]);

  const allLoading = loading || clientsLoading || productsLoading || teamLoading || transactionsLoading;

  return {
    leads,
    clients,
    tasks,
    products,
    meetings,
    teamMembers,
    transactions,
    loading: allLoading,
    refetch
  };
};
