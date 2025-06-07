import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ProductionProject {
  id: string;
  name: string;
  description?: string;
  type: 'document' | 'mindmap' | 'kanban' | 'presentation';
  status: 'draft' | 'in_progress' | 'review' | 'completed';
  created_at: string;
  updated_at: string;
  created_by: string;
  collaborators: string[];
  data: any;
  folder_id?: string;
}

export interface ProductionFolder {
  id: string;
  name: string;
  parent_id?: string;
  created_at: string;
  created_by: string;
}

export interface CollaborationSession {
  id: string;
  project_id: string;
  user_id: string;
  cursor_position?: any;
  last_activity: string;
  is_active: boolean;
}

export function useProductionWorkspace() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeProject, setActiveProject] = useState<ProductionProject | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  // Fetch projects
  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ['production-projects'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('production_projects')
        .select('*')
        .or(`created_by.eq.${user.id},collaborators.cs.{${user.id}}`)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as ProductionProject[];
    },
    enabled: !!user
  });

  // Fetch folders
  const { data: folders = [] } = useQuery({
    queryKey: ['production-folders'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('production_folders')
        .select('*')
        .eq('created_by', user.id)
        .order('name');
      
      if (error) throw error;
      return data as ProductionFolder[];
    },
    enabled: !!user
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: Partial<ProductionProject>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('production_projects')
        .insert({
          ...projectData,
          created_by: user.id,
          collaborators: [user.id]
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production-projects'] });
      toast.success('Projeto criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar projeto: ' + error.message);
    }
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductionProject> }) => {
      const { error } = await supabase
        .from('production_projects')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production-projects'] });
    }
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('production_projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production-projects'] });
      toast.success('Projeto excluído com sucesso!');
    }
  });

  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: async (folderData: Partial<ProductionFolder>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('production_folders')
        .insert({
          ...folderData,
          created_by: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production-folders'] });
      toast.success('Pasta criada com sucesso!');
    }
  });

  const createProject = useCallback((data: Partial<ProductionProject>) => {
    createProjectMutation.mutate(data);
  }, [createProjectMutation]);

  const updateProject = useCallback((id: string, data: Partial<ProductionProject>) => {
    updateProjectMutation.mutate({ id, data });
  }, [updateProjectMutation]);

  const deleteProject = useCallback((id: string) => {
    deleteProjectMutation.mutate(id);
  }, [deleteProjectMutation]);

  const createFolder = useCallback((data: Partial<ProductionFolder>) => {
    createFolderMutation.mutate(data);
  }, [createFolderMutation]);

  // Auto-save functionality
  const autoSave = useCallback((projectId: string, data: any) => {
    updateProject(projectId, { data, updated_at: new Date().toISOString() });
  }, [updateProject]);

  return {
    projects,
    folders,
    activeProject,
    setActiveProject,
    selectedFolder,
    setSelectedFolder,
    loadingProjects,
    createProject,
    updateProject,
    deleteProject,
    createFolder,
    autoSave,
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending
  };
}
