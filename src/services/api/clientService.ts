
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { toast } from "sonner";

export const clientService = {
  async getClients(companyId: string): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      toast.error("Erro ao carregar clientes");
      return [];
    }
  },

  async getClientById(id: string): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      toast.error("Erro ao carregar dados do cliente");
      return null;
    }
  },

  async createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .maybeSingle();

      if (error) throw error;
      toast.success("Cliente criado com sucesso");
      return data;
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      toast.error("Erro ao criar cliente");
      return null;
    }
  },

  async updateClient(id: string, client: Partial<Client>): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(client)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      toast.success("Cliente atualizado com sucesso");
      return data;
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast.error("Erro ao atualizar cliente");
      return null;
    }
  },

  async deleteClient(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Cliente removido com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      toast.error("Erro ao remover cliente");
      return false;
    }
  }
};
