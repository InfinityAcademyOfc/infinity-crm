
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase';
import { useToast } from '@/hooks/use-toast';
import { logError } from '@/utils/logger';
import { TeamMember, DepartmentNode } from '@/types/team';

export interface Department {
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  children: DepartmentNode[];
}

export const useTeamManagement = () => {
  const { user, companyProfile } = useAuth();
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<DepartmentNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const companyId = useMemo(() => {
    return companyProfile?.company_id || user?.id || '';
  }, [companyProfile, user]);

  const loadMembers = useCallback(async () => {
    if (!companyId) return;

    const now = Date.now();
    // Cache por 3 minutos
    if (now - lastFetch < 3 * 60 * 1000) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', companyId)
        .order('name');

      if (error) throw error;

      const membersData: TeamMember[] = (data || []).map(profile => ({
        id: profile.id,
        name: profile.name || 'Usuário',
        email: profile.email,
        role: profile.role,
        department: profile.department || undefined,
        phone: profile.phone || undefined,
        avatar: profile.avatar || undefined,
        status: profile.status === 'active' ? 'active' : 'inactive',
        created_at: profile.created_at || new Date().toISOString(),
        tasksAssigned: 0, // Default values for required properties
        tasksCompleted: 0
      }));

      setMembers(membersData);
      
      // Organizar por departamentos
      const deptMap = new Map<string, TeamMember[]>();
      membersData.forEach(member => {
        const dept = member.department || 'Sem Departamento';
        if (!deptMap.has(dept)) {
          deptMap.set(dept, []);
        }
        deptMap.get(dept)!.push(member);
      });

      const departmentsData: DepartmentNode[] = Array.from(deptMap.entries()).map(([name, members]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        members,
        children: []
      }));

      setDepartments(departmentsData);
      setLastFetch(now);
    } catch (error) {
      logError('Erro ao carregar membros da equipe', error, { 
        component: 'useTeamManagement',
        companyId 
      });
      toast({
        title: "Erro",
        description: "Não foi possível carregar os membros da equipe",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [companyId, lastFetch, toast]);

  const handleDeleteMember = useCallback(async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'inactive' })
        .eq('id', memberId);

      if (error) throw error;

      setMembers(prev => prev.filter(m => m.id !== memberId));
      toast({
        title: "Membro removido",
        description: "O membro foi removido com sucesso"
      });
    } catch (error) {
      logError('Erro ao remover membro', error, { component: 'useTeamManagement' });
      toast({
        title: "Erro",
        description: "Não foi possível remover o membro",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleUpdateMember = useCallback(async (updatedMember: TeamMember) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updatedMember.name,
          role: updatedMember.role,
          department: updatedMember.department,
          phone: updatedMember.phone
        })
        .eq('id', updatedMember.id);

      if (error) throw error;

      setMembers(prev => prev.map(m => 
        m.id === updatedMember.id ? updatedMember : m
      ));

      toast({
        title: "Membro atualizado",
        description: "As informações do membro foram atualizadas"
      });
    } catch (error) {
      logError('Erro ao atualizar membro', error, { component: 'useTeamManagement' });
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o membro",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleAddDepartment = useCallback((name: string) => {
    const newDept: DepartmentNode = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      members: [],
      children: []
    };
    setDepartments(prev => [...prev, newDept]);
  }, []);

  const handleEditDepartment = useCallback((departmentId: string) => {
    // Implementation for editing department - simplified to match expected signature
    console.log('Edit department:', departmentId);
  }, []);

  const handleDeleteDepartment = useCallback((id: string) => {
    setDepartments(prev => prev.filter(dept => dept.id !== id));
  }, []);

  const handleMoveMember = useCallback((memberId: string, newDepartment: string) => {
    setMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, department: newDepartment } : member
    ));
  }, []);

  const filterMembers = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return members;
    
    const query = searchQuery.toLowerCase();
    return members.filter(member =>
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query) ||
      (member.department && member.department.toLowerCase().includes(query))
    );
  }, [members]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  return {
    members,
    departments,
    loading,
    handleDeleteMember,
    handleUpdateMember,
    handleAddDepartment,
    handleEditDepartment,
    handleDeleteDepartment,
    handleMoveMember,
    filterMembers,
    refetch: loadMembers
  };
};
