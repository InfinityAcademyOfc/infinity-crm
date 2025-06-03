
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  phone?: string;
  avatar?: string;
  status: string;
  company_id?: string;
  tasksAssigned?: number;
  tasksCompleted?: number;
  created_at: string;
  updated_at: string;
}

export const useTeamMembers = () => {
  const { company } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeamMembers = async () => {
    if (!company?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Erro ao buscar membros da equipe:', error);
      toast.error('Erro ao carregar equipe');
    } finally {
      setLoading(false);
    }
  };

  const createTeamMember = async (memberData: Omit<TeamMember, 'id' | 'created_at' | 'updated_at' | 'company_id'>) => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          ...memberData,
          company_id: company.id,
          tasksAssigned: 0,
          tasksCompleted: 0
        }])
        .select()
        .single();

      if (error) throw error;
      
      setTeamMembers(prev => [data, ...prev]);
      toast.success('Membro criado com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao criar membro:', error);
      toast.error('Erro ao criar membro');
      throw error;
    }
  };

  const inviteTeamMember = async (email: string, role: string = 'user') => {
    if (!company?.id) return;

    try {
      // Create invitation record
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          email,
          role,
          company_id: company.id,
          name: email.split('@')[0],
          status: 'invited',
          tasksAssigned: 0,
          tasksCompleted: 0
        }])
        .select()
        .single();

      if (error) throw error;
      
      setTeamMembers(prev => [data, ...prev]);
      toast.success('Convite enviado com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao convidar membro:', error);
      toast.error('Erro ao enviar convite');
      throw error;
    }
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setTeamMembers(prev => prev.map(member => member.id === id ? data : member));
      toast.success('Membro atualizado com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao atualizar membro:', error);
      toast.error('Erro ao atualizar membro');
      throw error;
    }
  };

  const removeTeamMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTeamMembers(prev => prev.filter(member => member.id !== id));
      toast.success('Membro removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      toast.error('Erro ao remover membro');
    }
  };

  const deleteTeamMember = removeTeamMember;

  useEffect(() => {
    fetchTeamMembers();
  }, [company]);

  return {
    teamMembers,
    loading,
    createTeamMember,
    inviteTeamMember,
    updateTeamMember,
    removeTeamMember,
    deleteTeamMember,
    refetch: fetchTeamMembers
  };
};
