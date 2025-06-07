
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  target_value: number;
  current_value: number;
  target_date: string;
  status: 'active' | 'completed' | 'paused';
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
      setGoals(data || []);
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      toast.error('Erro ao carregar metas');
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goal: Omit<Goal, 'id' | 'created_at' | 'updated_at' | 'company_id'>) => {
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
      
      setGoals(prev => [data, ...prev]);
      toast.success('Meta criada com sucesso!');
      return data;
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
      
      setGoals(prev => prev.map(g => g.id === id ? data : g));
      toast.success('Meta atualizada com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
      toast.error('Erro ao atualizar meta');
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
    refetch: fetchGoals
  };
};
