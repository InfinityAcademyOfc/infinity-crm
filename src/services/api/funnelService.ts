
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface FunnelStage {
  id: string;
  company_id: string;
  name: string;
  color: string;
  order_index: number;
  created_at: string;
}

export interface SalesLead {
  id: string;
  company_id: string;
  name: string;
  email?: string;
  phone?: string;
  description?: string;
  value?: number;
  source?: string;
  assigned_to?: string;
  priority: string;
  stage?: string;
  stage_id?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  created_by?: string;
  type: string;
  description: string;
  created_at: string;
}

export const funnelService = {
  async getFunnelStages(companyId: string): Promise<FunnelStage[]> {
    try {
      const { data, error } = await supabase
        .from('funnel_stages')
        .select('*')
        .eq('company_id', companyId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar etapas do funil:", error);
      return [];
    }
  },

  async getSalesLeads(companyId: string): Promise<SalesLead[]> {
    try {
      const { data, error } = await supabase
        .from('sales_leads')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar leads:", error);
      return [];
    }
  },

  async createLead(lead: Omit<SalesLead, 'id' | 'created_at' | 'updated_at'>): Promise<SalesLead | null> {
    try {
      const { data, error } = await supabase
        .from('sales_leads')
        .insert(lead)
        .select()
        .single();

      if (error) throw error;
      
      // Log activity
      if (data) {
        await this.createLeadActivity(data.id, 'created', `Lead ${lead.name} foi criado`);
      }
      
      return data;
    } catch (error) {
      console.error("Erro ao criar lead:", error);
      return null;
    }
  },

  async updateLead(id: string, updates: Partial<SalesLead>): Promise<SalesLead | null> {
    try {
      const { data, error } = await supabase
        .from('sales_leads')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao atualizar lead:", error);
      return null;
    }
  },

  async updateLeadStage(leadId: string, stageId: string, stageName: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('sales_leads')
        .update({ 
          stage_id: stageId,
          stage: stageName,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;

      // Log activity
      await this.createLeadActivity(leadId, 'stage_changed', `Lead movido para ${stageName}`);
      
      return true;
    } catch (error) {
      console.error("Erro ao atualizar etapa do lead:", error);
      return false;
    }
  },

  async deleteLead(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('sales_leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Erro ao excluir lead:", error);
      return false;
    }
  },

  async createLeadActivity(leadId: string, type: string, description: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('lead_activities')
        .insert({
          lead_id: leadId,
          type,
          description,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
    } catch (error) {
      console.error("Erro ao criar atividade do lead:", error);
    }
  },

  async getLeadActivities(leadId: string): Promise<LeadActivity[]> {
    try {
      const { data, error } = await supabase
        .from('lead_activities')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar atividades do lead:", error);
      return [];
    }
  }
};
