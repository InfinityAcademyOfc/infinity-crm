
import { supabase } from "@/integrations/supabase/client";
import { TeamHierarchy, ProductionProject } from "@/types/team";

export const teamService = {
  async getTeamHierarchy(companyId: string): Promise<TeamHierarchy[]> {
    // Buscar todos os profiles da empresa (removendo position que não existe ainda)
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        email,
        role,
        department,
        manager_id
      `)
      .eq('company_id', companyId);

    if (error) {
      console.error('Error fetching team hierarchy:', error);
      throw error;
    }

    // Construir hierarquia manualmente
    const hierarchy: TeamHierarchy[] = [];
    const profileMap = new Map();

    // Criar mapa de profiles
    profiles?.forEach(profile => {
      profileMap.set(profile.id, {
        ...profile,
        position: null, // Adicionar position como null por enquanto
        manager_name: null,
        level: 0
      });
    });

    // Adicionar nomes dos managers e calcular níveis
    profiles?.forEach(profile => {
      if (profile.manager_id && profileMap.has(profile.manager_id)) {
        const manager = profileMap.get(profile.manager_id);
        profileMap.get(profile.id).manager_name = manager.name;
        profileMap.get(profile.id).level = manager.level + 1;
      }
    });

    // Converter para array
    profileMap.forEach(profile => {
      hierarchy.push(profile);
    });

    return hierarchy.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  },

  async updateTeamMember(memberId: string, updates: Partial<any>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', memberId)
      .select()
      .single();

    if (error) {
      console.error('Error updating team member:', error);
      throw error;
    }

    return data;
  },

  async getProductionProjects(companyId: string): Promise<ProductionProject[]> {
    const { data, error } = await supabase
      .from('production_projects')
      .select(`
        *,
        project_manager:profiles!project_manager_id(name, email)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching production projects:', error);
      throw error;
    }

    return data || [];
  },

  async createProductionProject(project: Omit<ProductionProject, 'id' | 'created_at' | 'updated_at'>): Promise<ProductionProject> {
    // Garantir que todos os campos obrigatórios estão presentes
    const projectData = {
      company_id: project.company_id,
      name: project.name,
      description: project.description || null,
      status: project.status || 'planning',
      priority: project.priority || 'medium',
      start_date: project.start_date || null,
      end_date: project.end_date || null,
      budget: project.budget || null,
      progress: project.progress || 0,
      project_manager_id: project.project_manager_id || null,
      team_members: project.team_members || [],
      created_by: project.created_by || null
    };

    const { data, error } = await supabase
      .from('production_projects')
      .insert(projectData)
      .select()
      .single();

    if (error) {
      console.error('Error creating production project:', error);
      throw error;
    }

    return data;
  },

  async updateProductionProject(projectId: string, updates: Partial<ProductionProject>): Promise<ProductionProject> {
    const { data, error } = await supabase
      .from('production_projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      console.error('Error updating production project:', error);
      throw error;
    }

    return data;
  },

  async deleteProductionProject(projectId: string): Promise<void> {
    const { error } = await supabase
      .from('production_projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      console.error('Error deleting production project:', error);
      throw error;
    }
  }
};
