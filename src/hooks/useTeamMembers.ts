
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  department: string | null;
  avatar: string | null;
  status: string;
  company_id: string | null;
  created_at: string;
  updated_at: string;
  tasksAssigned: number;
  tasksCompleted: number;
  joinedDate?: string;
}

export const useTeamMembers = () => {
  const { user, company } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeamMembers = async () => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', company.id)
        .order('name');

      if (error) throw error;
      
      // Transform data to include required properties
      const transformedMembers: TeamMember[] = (data || []).map(member => ({
        ...member,
        tasksAssigned: 0, // Can be calculated from tasks table
        tasksCompleted: 0, // Can be calculated from tasks table
        joinedDate: member.created_at
      }));
      
      setTeamMembers(transformedMembers);
    } catch (error) {
      console.error('Erro ao buscar membros da equipe:', error);
      toast.error('Erro ao carregar membros da equipe');
    } finally {
      setLoading(false);
    }
  };

  const createTeamMember = async (member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at' | 'company_id' | 'tasksAssigned' | 'tasksCompleted'>) => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          ...member,
          company_id: company.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      const newMember: TeamMember = {
        ...data,
        tasksAssigned: 0,
        tasksCompleted: 0,
        joinedDate: data.created_at
      };
      
      setTeamMembers(prev => [...prev, newMember]);
      toast.success('Membro da equipe adicionado com sucesso!');
      return newMember;
    } catch (error) {
      console.error('Erro ao criar membro da equipe:', error);
      toast.error('Erro ao adicionar membro da equipe');
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
      
      const updatedMember: TeamMember = {
        ...data,
        tasksAssigned: 0,
        tasksCompleted: 0,
        joinedDate: data.created_at
      };
      
      setTeamMembers(prev => prev.map(m => m.id === id ? updatedMember : m));
      toast.success('Membro da equipe atualizado com sucesso!');
      return updatedMember;
    } catch (error) {
      console.error('Erro ao atualizar membro da equipe:', error);
      toast.error('Erro ao atualizar membro da equipe');
      throw error;
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTeamMembers(prev => prev.filter(m => m.id !== id));
      toast.success('Membro da equipe removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover membro da equipe:', error);
      toast.error('Erro ao remover membro da equipe');
      throw error;
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [company]);

  return {
    teamMembers,
    loading,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    refetch: fetchTeamMembers
  };
};
