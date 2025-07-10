
import { supabase } from "@/integrations/supabase/client";
import { TeamHierarchy, ProductionProject } from "@/types/team";

export const teamService = {
  async getTeamHierarchy(companyId: string): Promise<TeamHierarchy[]> {
    const { data, error } = await supabase.rpc('get_team_hierarchy', {
      company_uuid: companyId
    });

    if (error) {
      console.error('Error fetching team hierarchy:', error);
      throw error;
    }

    return data || [];
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
    const { data, error } = await supabase
      .from('production_projects')
      .insert(project)
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
