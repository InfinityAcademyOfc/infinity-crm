
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/lead";
import { toast } from "sonner";

export const leadService = {
  async getLeads(companyId: string): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Validate and transform data to ensure proper types
      const validatedData = (data || []).map(lead => ({
        ...lead,
        priority: (['high', 'medium', 'low'].includes(lead.priority) 
          ? lead.priority 
          : 'medium') as 'high' | 'medium' | 'low',
        status: (['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'].includes(lead.status) 
          ? lead.status 
          : 'new') as 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
      })) as Lead[];

      return validatedData;
    } catch (error) {
      console.error("Erro ao buscar leads:", error);
      toast.error("Erro ao carregar leads");
      return [];
    }
  },

  async getLeadById(id: string): Promise<Lead | null> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) return null;

      // Validate and transform data
      const validatedData = {
        ...data,
        priority: (['high', 'medium', 'low'].includes(data.priority) 
          ? data.priority 
          : 'medium') as 'high' | 'medium' | 'low',
        status: (['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'].includes(data.status) 
          ? data.status 
          : 'new') as 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
      } as Lead;

      return validatedData;
    } catch (error) {
      console.error("Erro ao buscar lead:", error);
      toast.error("Erro ao carregar dados do lead");
      return null;
    }
  },

  async createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead | null> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert(lead)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const validatedData = {
        ...data,
        priority: (['high', 'medium', 'low'].includes(data.priority) 
          ? data.priority 
          : 'medium') as 'high' | 'medium' | 'low',
        status: (['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'].includes(data.status) 
          ? data.status 
          : 'new') as 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
      } as Lead;

      toast.success("Lead criado com sucesso");
      return validatedData;
    } catch (error) {
      console.error("Erro ao criar lead:", error);
      toast.error("Erro ao criar lead");
      return null;
    }
  },

  async updateLead(id: string, lead: Partial<Lead>): Promise<Lead | null> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update(lead)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const validatedData = {
        ...data,
        priority: (['high', 'medium', 'low'].includes(data.priority) 
          ? data.priority 
          : 'medium') as 'high' | 'medium' | 'low',
        status: (['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'].includes(data.status) 
          ? data.status 
          : 'new') as 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
      } as Lead;

      toast.success("Lead atualizado com sucesso");
      return validatedData;
    } catch (error) {
      console.error("Erro ao atualizar lead:", error);
      toast.error("Erro ao atualizar lead");
      return null;
    }
  },

  async deleteLead(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Lead removido com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao excluir lead:", error);
      toast.error("Erro ao remover lead");
      return false;
    }
  }
};
