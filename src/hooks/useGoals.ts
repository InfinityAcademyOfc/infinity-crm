
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  target_value: number;
  current_value: number;
  target_date: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  company_id: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useGoals = () => {
  const { company } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    if (!company?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const validatedData = (data || []).map(goal => ({
        ...goal,
        status: (['active', 'completed', 'paused', 'cancelled'].includes(goal.status) 
          ? goal.status 
          : 'active') as 'active' | 'completed' | 'paused' | 'cancelled'
      })) as Goal[];

      setGoals(validatedData);
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      toast.error('Erro ao carregar metas');
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goal: Omit<Goal, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([{
          ...goal,
          company_id: company.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      const validatedData = {
        ...data,
        status: (['active', 'completed', 'paused', 'cancelled'].includes(data.status) 
          ? data.status 
          : 'active') as 'active' | 'completed' | 'paused' | 'cancelled'
      } as Goal;

      setGoals(prev => [validatedData, ...prev]);
      toast.success('Meta criada com sucesso!');
      return validatedData;
    } catch (error) {
      console.error('Erro ao criar meta:', error);
      toast.error('Erro ao criar meta');
      throw error;
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const validatedData = {
        ...data,
        status: (['active', 'completed', 'paused', 'cancelled'].includes(data.status) 
          ? data.status 
          : 'active') as 'active' | 'completed' | 'paused' | 'cancelled'
      } as Goal;

      setGoals(prev => prev.map(g => g.id === id ? validatedData : g));
      toast.success('Meta atualizada com sucesso!');
      return validatedData;
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
      toast.error('Erro ao atualizar meta');
      throw error;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setGoals(prev => prev.filter(g => g.id !== id));
      toast.success('Meta excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
      toast.error('Erro ao excluir meta');
      throw error;
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [company]);

  return {
    goals,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals
  };
};
