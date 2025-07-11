
import { supabase } from "@/integrations/supabase/client";
import { TeamHierarchy, ProductionProject } from "@/types/team";

export const teamService = {
  async getTeamHierarchy(companyId: string): Promise<TeamHierarchy[]> {
    // First check if manager_id column exists, if not return simple hierarchy
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        email,
        role,
        department
      `)
      .eq('company_id', companyId);

    if (error) {
      console.error('Error fetching team hierarchy:', error);
      throw error;
    }

    // Build simple hierarchy without manager relationships for now
    const hierarchy: TeamHierarchy[] = [];

    profiles?.forEach(profile => {
      hierarchy.push({
        ...profile,
        position: null,
        manager_id: null,
        manager_name: null,
        level: 0
      });
    });

    return hierarchy.sort((a, b) => a.name.localeCompare(b.name));
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
    // Use the existing production_projects table structure
    const { data, error } = await supabase
      .from('production_projects')
      .select(`
        id,
        company_id,
        name,
        description,
        status,
        type,
        created_at,
        updated_at,
        created_by,
        collaborators,
        data
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching production projects:', error);
      throw error;
    }

    // Transform the data to match ProductionProject interface
    const projects: ProductionProject[] = (data || []).map(project => ({
      id: project.id,
      company_id: project.company_id,
      name: project.name,
      description: project.description || '',
      status: project.status as 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled',
      priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent', // Default priority
      start_date: null,
      end_date: null,
      budget: null,
      progress: 0,
      project_manager_id: null,
      team_members: project.collaborators || [],
      created_by: project.created_by,
      created_at: project.created_at,
      updated_at: project.updated_at
    }));

    return projects;
  },

  async createProductionProject(project: Omit<ProductionProject, 'id' | 'created_at' | 'updated_at'>): Promise<ProductionProject> {
    // Map ProductionProject to the actual table structure
    const projectData = {
      company_id: project.company_id,
      name: project.name,
      description: project.description || null,
      status: project.status || 'planning',
      type: 'project', // Required field in the actual table
      created_by: project.created_by || null,
      collaborators: project.team_members || []
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

    // Transform back to ProductionProject interface
    return {
      id: data.id,
      company_id: data.company_id,
      name: data.name,
      description: data.description || '',
      status: data.status as 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled',
      priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
      start_date: null,
      end_date: null,
      budget: null,
      progress: 0,
      project_manager_id: null,
      team_members: data.collaborators || [],
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },

  async updateProductionProject(projectId: string, updates: Partial<ProductionProject>): Promise<ProductionProject> {
    // Map updates to the actual table structure
    const updateData: any = {};
    
    if (updates.name) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status) updateData.status = updates.status;
    if (updates.team_members) updateData.collaborators = updates.team_members;

    const { data, error } = await supabase
      .from('production_projects')
      .update(updateData)
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      console.error('Error updating production project:', error);
      throw error;
    }

    // Transform back to ProductionProject interface
    return {
      id: data.id,
      company_id: data.company_id,
      name: data.name,
      description: data.description || '',
      status: data.status as 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled',
      priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
      start_date: null,
      end_date: null,
      budget: null,
      progress: 0,
      project_manager_id: null,
      team_members: data.collaborators || [],
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
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
