
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
  status: string;
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
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
      toast.error('Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activity: Omit<Activity, 'id' | 'created_at' | 'company_id'>) => {
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
      
      setActivities(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      toast.error('Erro ao criar atividade');
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
    refetch: fetchActivities
  };
};
