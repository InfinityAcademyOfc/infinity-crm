
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Activity {
  id: string;
  type: string;
  title: string;
  description: string | null;
  related_to: string | null;
  related_id: string | null;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  company_id: string;
  created_by: string | null;
  created_at: string;
}

export const useActivities = () => {
  const { company } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    if (!company?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const validatedData = (data || []).map(activity => ({
        ...activity,
        priority: (['low', 'medium', 'high'].includes(activity.priority) 
          ? activity.priority 
          : 'medium') as 'low' | 'medium' | 'high',
        status: (['pending', 'in_progress', 'completed', 'cancelled'].includes(activity.status) 
          ? activity.status 
          : 'pending') as 'pending' | 'in_progress' | 'completed' | 'cancelled'
      })) as Activity[];

      setActivities(validatedData);
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
      toast.error('Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activity: Omit<Activity, 'id' | 'company_id' | 'created_at'>) => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('activities')
        .insert([{
          ...activity,
          company_id: company.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      const validatedData = {
        ...data,
        priority: (['low', 'medium', 'high'].includes(data.priority) 
          ? data.priority 
          : 'medium') as 'low' | 'medium' | 'high',
        status: (['pending', 'in_progress', 'completed', 'cancelled'].includes(data.status) 
          ? data.status 
          : 'pending') as 'pending' | 'in_progress' | 'completed' | 'cancelled'
      } as Activity;

      setActivities(prev => [validatedData, ...prev]);
      toast.success('Atividade criada com sucesso!');
      return validatedData;
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      toast.error('Erro ao criar atividade');
      throw error;
    }
  };

  const updateActivity = async (id: string, updates: Partial<Activity>) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const validatedData = {
        ...data,
        priority: (['low', 'medium', 'high'].includes(data.priority) 
          ? data.priority 
          : 'medium') as 'low' | 'medium' | 'high',
        status: (['pending', 'in_progress', 'completed', 'cancelled'].includes(data.status) 
          ? data.status 
          : 'pending') as 'pending' | 'in_progress' | 'completed' | 'cancelled'
      } as Activity;

      setActivities(prev => prev.map(a => a.id === id ? validatedData : a));
      toast.success('Atividade atualizada com sucesso!');
      return validatedData;
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
      toast.error('Erro ao atualizar atividade');
      throw error;
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setActivities(prev => prev.filter(a => a.id !== id));
      toast.success('Atividade excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir atividade:', error);
      toast.error('Erro ao excluir atividade');
      throw error;
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [company]);

  return {
    activities,
    loading,
    createActivity,
    updateActivity,
    deleteActivity,
    refetch: fetchActivities
  };
};
