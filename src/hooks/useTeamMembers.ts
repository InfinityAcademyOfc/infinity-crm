
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { TeamMember } from '@/types/team';

interface DatabaseTeamMember {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  department: string | null;
  avatar: string | null;
  status: string;
  company_id: string | null;
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
      
      // Transform database data to TeamMember type
      const transformedMembers: TeamMember[] = (data || []).map((member: DatabaseTeamMember) => ({
        id: member.id,
        name: member.name || member.email.split('@')[0],
        email: member.email,
        phone: member.phone || '',
        role: member.role,
        department: member.department || '',
        status: (['active', 'inactive'].includes(member.status) ? member.status : 'active') as 'active' | 'inactive',
        avatar: member.avatar,
        avatar_url: member.avatar,
        tasksAssigned: Math.floor(Math.random() * 10) + 1, // Mock data
        tasksCompleted: Math.floor(Math.random() * 8) + 1, // Mock data
        company_id: member.company_id || company.id,
        created_at: member.created_at,
        updated_at: member.updated_at
      }));

      setTeamMembers(transformedMembers);
    } catch (error) {
      console.error('Erro ao buscar equipe:', error);
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
          name: member.name || null,
          email: member.email,
          phone: member.phone || null,
          role: member.role,
          department: member.department || null,
          avatar: member.avatar || null,
          status: member.status,
          company_id: company.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Transform to TeamMember type
      const transformedMember: TeamMember = {
        id: data.id,
        name: data.name || data.email.split('@')[0],
        email: data.email,
        phone: data.phone || '',
        role: data.role,
        department: data.department || '',
        status: data.status as 'active' | 'inactive',
        avatar: data.avatar,
        avatar_url: data.avatar,
        tasksAssigned: 0,
        tasksCompleted: 0,
        company_id: data.company_id,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setTeamMembers(prev => [transformedMember, ...prev]);
      toast.success('Membro da equipe adicionado com sucesso!');
      return transformedMember;
    } catch (error) {
      console.error('Erro ao criar membro:', error);
      toast.error('Erro ao adicionar membro da equipe');
      throw error;
    }
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          phone: updates.phone,
          role: updates.role,
          department: updates.department,
          avatar: updates.avatar,
          status: updates.status
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Transform to TeamMember type
      const transformedMember: TeamMember = {
        id: data.id,
        name: data.name || data.email.split('@')[0],
        email: data.email,
        phone: data.phone || '',
        role: data.role,
        department: data.department || '',
        status: data.status as 'active' | 'inactive',
        avatar: data.avatar,
        avatar_url: data.avatar,
        tasksAssigned: teamMembers.find(m => m.id === id)?.tasksAssigned || 0,
        tasksCompleted: teamMembers.find(m => m.id === id)?.tasksCompleted || 0,
        company_id: data.company_id,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setTeamMembers(prev => prev.map(m => m.id === id ? transformedMember : m));
      toast.success('Membro atualizado com sucesso!');
      return transformedMember;
    } catch (error) {
      console.error('Erro ao atualizar membro:', error);
      toast.error('Erro ao atualizar membro');
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
      toast.success('Membro removido com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir membro:', error);
      toast.error('Erro ao remover membro');
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
