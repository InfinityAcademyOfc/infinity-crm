
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
    if (!company?.id || !user?.id) {
      toast.error('Empresa ou usuário não encontrado');
      return;
    }

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('production_projects')
        .insert([
          {
            ...projectData,
            company_id: company.id,
            created_by: user.id
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar projeto:', error);
        toast.error('Erro ao criar projeto');
        return;
      }

      const validatedData = {
        ...data,
        type: (['document', 'mindmap', 'kanban', 'presentation'].includes(data.type) 
          ? data.type 
          : 'document') as 'document' | 'mindmap' | 'kanban' | 'presentation',
        status: (['draft', 'in_progress', 'review', 'completed'].includes(data.status) 
          ? data.status 
          : 'draft') as 'draft' | 'in_progress' | 'review' | 'completed',
        collaborators: data.collaborators || [],
        created_by: data.created_by || user.id
      } as ProductionProject;

      setProjects(prev => [validatedData, ...prev]);
      toast.success('Projeto criado com sucesso!');
      return validatedData;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      toast.error('Erro ao criar projeto');
    } finally {
      setIsCreating(false);
    }
  };

  const updateProject = async (id: string, projectData: Partial<ProductionProject>) => {
    try {
      const { data, error } = await supabase
        .from('production_projects')
        .update(projectData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar projeto:', error);
        toast.error('Erro ao atualizar projeto');
        return;
      }

      const validatedData = {
        ...data,
        type: (['document', 'mindmap', 'kanban', 'presentation'].includes(data.type) 
          ? data.type 
          : 'document') as 'document' | 'mindmap' | 'kanban' | 'presentation',
        status: (['draft', 'in_progress', 'review', 'completed'].includes(data.status) 
          ? data.status 
          : 'draft') as 'draft' | 'in_progress' | 'review' | 'completed',
        collaborators: data.collaborators || [],
        created_by: data.created_by || user?.id || ''
      } as ProductionProject;

      setProjects(prev => prev.map(project => 
        project.id === id ? validatedData : project
      ));
      
      if (activeProject?.id === id) {
        setActiveProject(validatedData);
      }
      
      toast.success('Projeto atualizado com sucesso!');
      return validatedData;
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      toast.error('Erro ao atualizar projeto');
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('production_projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar projeto:', error);
        toast.error('Erro ao deletar projeto');
        return;
      }

      setProjects(prev => prev.filter(project => project.id !== id));
      
      if (activeProject?.id === id) {
        setActiveProject(null);
      }
      
      toast.success('Projeto removido com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      toast.error('Erro ao deletar projeto');
    }
  };

  const autoSave = async (projectId: string, data: any) => {
    try {
      await updateProject(projectId, { data });
    } catch (error) {
      console.error('Erro no auto-save:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [company?.id]);

  return {
    projects,
    loadingProjects,
    isCreating,
    activeProject,
    setActiveProject,
    createProject,
    updateProject,
    deleteProject,
    autoSave,
    refetch: fetchProjects
  };
};
