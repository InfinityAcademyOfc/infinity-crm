
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  participants: number;
  status: string;
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
        .order('date', { ascending: false });

      if (error) throw error;
      setMeetings(data || []);
    } catch (error) {
      console.error('Erro ao buscar reuniões:', error);
      toast.error('Erro ao carregar reuniões');
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async (meetingData: Omit<Meeting, 'id' | 'created_at' | 'updated_at' | 'company_id'>) => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('meetings')
        .insert([{
          ...meetingData,
          company_id: company.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setMeetings(prev => [data, ...prev]);
      toast.success('Reunião criada com sucesso!');
      return data;
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
      
      setMeetings(prev => prev.map(meeting => meeting.id === id ? data : meeting));
      toast.success('Reunião atualizada com sucesso!');
      return data;
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
      
      setMeetings(prev => prev.filter(meeting => meeting.id !== id));
      toast.success('Reunião excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir reunião:', error);
      toast.error('Erro ao excluir reunião');
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
