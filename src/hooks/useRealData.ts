
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
import { toast } from 'sonner';

export const useRealData = () => {
  const { company, user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use existing hooks
  const { clients, loading: clientsLoading, refetch: refetchClients } = useRealClientData();
  const { products, loading: productsLoading, refetch: refetchProducts } = useRealProducts();
  const { teamMembers, loading: teamLoading, refetch: refetchTeam } = useTeamMembers();
  const { transactions, loading: transactionsLoading, refetch: refetchTransactions } = useFinancialData();
  const { meetings, loading: meetingsLoading, refetch: refetchMeetings } = useMeetings();
  const { activities, loading: activitiesLoading, refetch: refetchActivities } = useActivities();
  const { goals, loading: goalsLoading, refetch: refetchGoals } = useGoals();

  const fetchLeads = async () => {
    if (!company?.id) {
      setLeads([]);
      return;
    }

    try {
      console.log('Fetching leads for company:', company.id);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        throw error;
      }
      
      const validatedData = (data || []).map(lead => ({
        ...lead,
        priority: (['high', 'medium', 'low'].includes(lead.priority) 
          ? lead.priority 
          : 'medium') as 'high' | 'medium' | 'low',
        status: (['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'].includes(lead.status) 
          ? lead.status 
          : 'new') as 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
      })) as Lead[];

      setLeads(validatedData);
      console.log('Leads loaded:', validatedData.length);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      setError('Erro ao carregar leads');
      toast.error('Erro ao carregar leads');
    }
  };

  const fetchTasks = async () => {
    if (!company?.id) {
      setTasks([]);
      return;
    }

    try {
      console.log('Fetching tasks for company:', company.id);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }

      const validatedData = (data || []).map(task => ({
        ...task,
        priority: (['high', 'medium', 'low'].includes(task.priority) 
          ? task.priority 
          : 'medium') as 'high' | 'medium' | 'low',
        status: (['pending', 'in_progress', 'completed', 'cancelled'].includes(task.status) 
          ? task.status 
          : 'pending') as 'pending' | 'in_progress' | 'completed' | 'cancelled'
      })) as Task[];

      setTasks(validatedData);
      console.log('Tasks loaded:', validatedData.length);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      setError('Erro ao carregar tarefas');
      toast.error('Erro ao carregar tarefas');
    }
  };

  const refetch = async () => {
    if (!company?.id || !user) {
      console.log('No company or user available for refetch');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
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
    } catch (error) {
      console.error('Error during refetch:', error);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (company?.id && user) {
      console.log('Company and user available, fetching data...', { companyId: company.id, userId: user.id });
      refetch();
    } else {
      console.log('No company or user, skipping data fetch', { company: !!company, user: !!user });
      setLoading(false);
    }
  }, [company?.id, user?.id]);

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
    error,
    refetch
  };
};
