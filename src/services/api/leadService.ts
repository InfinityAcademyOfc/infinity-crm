
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
      return data || [];
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
      return data;
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
      toast.success("Lead criado com sucesso");
      return data;
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
      toast.success("Lead atualizado com sucesso");
      return data;
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
