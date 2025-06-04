
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

  const { clients, loading: clientsLoading } = useRealClientData();
  const { products, loading: productsLoading } = useRealProducts();
  const { teamMembers, loading: teamLoading } = useTeamMembers();
  const { transactions, loading: transactionsLoading } = useFinancialData();
  const { meetings, loading: meetingsLoading } = useMeetings();
  const { activities, loading: activitiesLoading } = useActivities();
  const { goals, loading: goalsLoading } = useGoals();

  const fetchLeads = async () => {
    if (!company?.id) {
      setLeads([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
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
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      setError('Erro ao carregar leads');
    }
  };

  const fetchTasks = async () => {
    if (!company?.id) {
      setTasks([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

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
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      setError('Erro ao carregar tarefas');
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      if (!company?.id || !user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchLeads(),
          fetchTasks()
        ]);
      } catch (error) {
        console.error('Error during data fetch:', error);
        if (mounted) {
          setError('Erro ao carregar dados');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();
    
    return () => {
      mounted = false;
    };
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
    error
  };
};
