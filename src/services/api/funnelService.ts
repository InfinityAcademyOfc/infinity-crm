
import { supabase } from "@/integrations/supabase/client";

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
  stage_id?: string;
  stage?: string;
  priority: string;
  status: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export const funnelService = {
  async getFunnelStages(companyId: string): Promise<FunnelStage[]> {
    const { data, error } = await supabase
      .from('funnel_stages')
      .select('*')
      .eq('company_id', companyId)
      .order('order_index');
    
    if (error) {
      console.error('Erro ao buscar stages do funil:', error);
      return [];
    }
    
    return data || [];
  },

  async getSalesLeads(companyId: string): Promise<SalesLead[]> {
    const { data, error } = await supabase
      .from('sales_leads')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar leads:', error);
      return [];
    }
    
    return data || [];
  },

  async createLead(leadData: Partial<SalesLead>): Promise<SalesLead | null> {
    const { data, error } = await supabase
      .from('sales_leads')
      .insert(leadData)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar lead:', error);
      return null;
    }
    
    return data;
  },

  async updateLead(leadId: string, updates: Partial<SalesLead>): Promise<SalesLead | null> {
    const { data, error } = await supabase
      .from('sales_leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', leadId)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar lead:', error);
      return null;
    }
    
    return data;
  },

  async updateLeadStage(leadId: string, stageId: string, stageName: string): Promise<boolean> {
    const { error } = await supabase
      .from('sales_leads')
      .update({ 
        stage_id: stageId, 
        stage: stageName,
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId);
    
    if (error) {
      console.error('Erro ao atualizar stage do lead:', error);
      return false;
    }
    
    return true;
  },

  async deleteLead(leadId: string): Promise<boolean> {
    const { error } = await supabase
      .from('sales_leads')
      .delete()
      .eq('id', leadId);
    
    if (error) {
      console.error('Erro ao deletar lead:', error);
      return false;
    }
    
    return true;
  },

  async createFunnelStage(companyId: string, name: string, color: string, orderIndex: number): Promise<FunnelStage | null> {
    const { data, error } = await supabase
      .from('funnel_stages')
      .insert({
        company_id: companyId,
        name,
        color,
        order_index: orderIndex
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar stage do funil:', error);
      return null;
    }
    
    return data;
  },

  async initializeDefaultStages(companyId: string): Promise<void> {
    const defaultStages = [
      { name: 'Prospecção', color: '#ef4444', order_index: 0 },
      { name: 'Qualificação', color: '#f97316', order_index: 1 },
      { name: 'Proposta', color: '#eab308', order_index: 2 },
      { name: 'Negociação', color: '#3b82f6', order_index: 3 },
      { name: 'Ganhos', color: '#22c55e', order_index: 4 }
    ];

    const { error } = await supabase
      .from('funnel_stages')
      .insert(defaultStages.map(stage => ({
        ...stage,
        company_id: companyId
      })));

    if (error) {
      console.error('Erro ao inicializar stages padrão:', error);
    }
  }
};
