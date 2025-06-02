
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ProductionProject {
  id: string;
  name: string;
  description: string | null;
  type: 'document' | 'mindmap' | 'kanban' | 'presentation';
  status: 'draft' | 'in_progress' | 'review' | 'completed';
  data: any;
  company_id: string;
  created_by: string;
  collaborators?: string[];
  folder_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductionFolder {
  id: string;
  name: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export const useProductionWorkspace = () => {
  const [projects, setProjects] = useState<ProductionProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [activeProject, setActiveProject] = useState<ProductionProject | null>(null);
  const { company, user } = useAuth();

  const fetchProjects = async () => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('production_projects')
        .select('*')
        .eq('company_id', company.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar projetos:', error);
        toast.error('Erro ao carregar projetos');
        return;
      }

      // Transform and validate data
      const validatedData = (data || []).map(project => ({
        ...project,
        type: (['document', 'mindmap', 'kanban', 'presentation'].includes(project.type) 
          ? project.type 
          : 'document') as 'document' | 'mindmap' | 'kanban' | 'presentation',
        status: (['draft', 'in_progress', 'review', 'completed'].includes(project.status) 
          ? project.status 
          : 'draft') as 'draft' | 'in_progress' | 'review' | 'completed',
        collaborators: project.collaborators || [],
        created_by: project.created_by || user?.id || ''
      })) as ProductionProject[];

      setProjects(validatedData);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      toast.error('Erro ao carregar projetos');
    } finally {
      setLoadingProjects(false);
    }
  };

  const createProject = async (projectData: Omit<ProductionProject, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    if (!company?.id || !user?.id) return null;

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('production_projects')
        .insert([{
          ...projectData,
          company_id: company.id,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      const newProject = {
        ...data,
        type: data.type as 'document' | 'mindmap' | 'kanban' | 'presentation',
        status: data.status as 'draft' | 'in_progress' | 'review' | 'completed',
        collaborators: data.collaborators || []
      } as ProductionProject;

      setProjects(prev => [newProject, ...prev]);
      toast.success('Projeto criado com sucesso!');
      return newProject;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      toast.error('Erro ao criar projeto');
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const updateProject = async (id: string, updates: Partial<ProductionProject>) => {
    try {
      const { data, error } = await supabase
        .from('production_projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedProject = {
        ...data,
        type: data.type as 'document' | 'mindmap' | 'kanban' | 'presentation',
        status: data.status as 'draft' | 'in_progress' | 'review' | 'completed',
        collaborators: data.collaborators || []
      } as ProductionProject;

      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      if (activeProject?.id === id) {
        setActiveProject(updatedProject);
      }
      toast.success('Projeto atualizado com sucesso!');
      return updatedProject;
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      toast.error('Erro ao atualizar projeto');
      return null;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('production_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== id));
      if (activeProject?.id === id) {
        setActiveProject(null);
      }
      toast.success('Projeto excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      toast.error('Erro ao excluir projeto');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [company]);

  return {
    projects,
    loadingProjects,
    isCreating,
    activeProject,
    setActiveProject,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects
  };
};
