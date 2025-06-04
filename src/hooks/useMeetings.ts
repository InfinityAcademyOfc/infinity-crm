
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  participants: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  company_id: string;
  created_at: string;
  updated_at: string;
}

export const useMeetings = () => {
  const { company } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMeetings = async () => {
    if (!company?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('company_id', company.id)
        .order('date', { ascending: true });

      if (error) throw error;
      
      // Validar e converter dados
      const validatedData = (data || []).map(meeting => ({
        ...meeting,
        status: (['scheduled', 'in_progress', 'completed', 'cancelled'].includes(meeting.status) 
          ? meeting.status 
          : 'scheduled') as 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
      })) as Meeting[];

      setMeetings(validatedData);
    } catch (error) {
      console.error('Erro ao buscar reuniões:', error);
      toast.error('Erro ao carregar reuniões');
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async (meeting: Omit<Meeting, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('meetings')
        .insert([{
          ...meeting,
          company_id: company.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      const validatedData = {
        ...data,
        status: (['scheduled', 'in_progress', 'completed', 'cancelled'].includes(data.status) 
          ? data.status 
          : 'scheduled') as 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
      } as Meeting;

      setMeetings(prev => [...prev, validatedData]);
      toast.success('Reunião criada com sucesso!');
      return validatedData;
    } catch (error) {
      console.error('Erro ao criar reunião:', error);
      toast.error('Erro ao criar reunião');
      throw error;
    }
  };

  const updateMeeting = async (id: string, updates: Partial<Meeting>) => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const validatedData = {
        ...data,
        status: (['scheduled', 'in_progress', 'completed', 'cancelled'].includes(data.status) 
          ? data.status 
          : 'scheduled') as 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
      } as Meeting;

      setMeetings(prev => prev.map(m => m.id === id ? validatedData : m));
      toast.success('Reunião atualizada com sucesso!');
      return validatedData;
    } catch (error) {
      console.error('Erro ao atualizar reunião:', error);
      toast.error('Erro ao atualizar reunião');
      throw error;
    }
  };

  const deleteMeeting = async (id: string) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMeetings(prev => prev.filter(m => m.id !== id));
      toast.success('Reunião excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir reunião:', error);
      toast.error('Erro ao excluir reunião');
      throw error;
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [company]);

  return {
    meetings,
    loading,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    refetch: fetchMeetings
  };
};
