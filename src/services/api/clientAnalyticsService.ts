
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { toast } from "sonner";

export interface ClientLTV {
  id: string;
  client_id: string;
  company_id: string;
  total_revenue: number;
  first_purchase_date: string;
  last_purchase_date: string;
  purchase_frequency: number;
  calculated_ltv: number;
  average_order_value: number;
  churn_probability: number;
  last_activity_date: string;
  updated_at: string;
}

export interface ClientNPS {
  id: string;
  client_id: string;
  company_id: string;
  score: number;
  feedback?: string;
  created_at: string;
}

export interface ClientSatisfaction {
  id: string;
  client_id: string;
  company_id: string;
  category: string;
  rating: number;
  comments?: string;
  created_at: string;
}

export const clientAnalyticsService = {
  async getClientLTV(companyId: string): Promise<ClientLTV[]> {
    try {
      const { data, error } = await supabase
        .from('client_ltv')
        .select('*')
        .eq('company_id', companyId)
        .order('calculated_ltv', { ascending: false });

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        average_order_value: (item as any).average_order_value || 0,
        churn_probability: (item as any).churn_probability || 0,
        last_activity_date: (item as any).last_activity_date || new Date().toISOString().split('T')[0]
      }));
    } catch (error) {
      console.error("Erro ao buscar LTV dos clientes:", error);
      toast.error("Erro ao carregar dados de LTV");
      return [];
    }
  },

  async updateClientLTV(clientId: string, companyId: string, data: Partial<ClientLTV>): Promise<ClientLTV | null> {
    try {
      const { data: result, error } = await supabase
        .from('client_ltv')
        .upsert({
          client_id: clientId,
          company_id: companyId,
          ...data,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      toast.success("LTV do cliente atualizado com sucesso");
      return {
        ...result,
        average_order_value: (result as any).average_order_value || 0,
        churn_probability: (result as any).churn_probability || 0,
        last_activity_date: (result as any).last_activity_date || new Date().toISOString().split('T')[0]
      };
    } catch (error) {
      console.error("Erro ao atualizar LTV:", error);
      toast.error("Erro ao atualizar LTV do cliente");
      return null;
    }
  },

  async getClientNPS(companyId: string): Promise<ClientNPS[]> {
    try {
      const { data, error } = await supabase
        .from('client_nps')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar NPS dos clientes:", error);
      toast.error("Erro ao carregar dados de NPS");
      return [];
    }
  },

  async createClientNPS(npsData: Omit<ClientNPS, 'id' | 'created_at'>): Promise<ClientNPS | null> {
    try {
      const { data, error } = await supabase
        .from('client_nps')
        .insert(npsData)
        .select()
        .single();

      if (error) throw error;
      toast.success("Avaliação NPS registrada com sucesso");
      return data;
    } catch (error) {
      console.error("Erro ao criar NPS:", error);
      toast.error("Erro ao registrar avaliação NPS");
      return null;
    }
  },

  async getClientSatisfaction(companyId: string): Promise<ClientSatisfaction[]> {
    try {
      const { data, error } = await supabase
        .from('client_satisfaction')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar satisfação dos clientes:", error);
      toast.error("Erro ao carregar dados de satisfação");
      return [];
    }
  },

  async createClientSatisfaction(satisfactionData: Omit<ClientSatisfaction, 'id' | 'created_at'>): Promise<ClientSatisfaction | null> {
    try {
      const { data, error } = await supabase
        .from('client_satisfaction')
        .insert(satisfactionData)
        .select()
        .single();

      if (error) throw error;
      toast.success("Avaliação de satisfação registrada com sucesso");
      return data;
    } catch (error) {
      console.error("Erro ao criar avaliação de satisfação:", error);
      toast.error("Erro ao registrar avaliação de satisfação");
      return null;
    }
  },

  async convertLeadToClient(leadId: string, clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client | null> {
    try {
      // Create new client
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert(clientData)
        .select()
        .single();

      if (clientError) throw clientError;

      // Update lead status to converted
      const { error: leadError } = await supabase
        .from('sales_leads')
        .update({ 
          stage: 'Ganhos',
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (leadError) throw leadError;

      // Initialize LTV record
      await this.updateClientLTV(newClient.id, clientData.company_id, {
        total_revenue: 0,
        purchase_frequency: 0,
        calculated_ltv: 0,
        average_order_value: 0,
        churn_probability: 0.1,
        first_purchase_date: new Date().toISOString().split('T')[0],
        last_activity_date: new Date().toISOString().split('T')[0]
      });

      toast.success("Lead convertido em cliente com sucesso");
      return newClient;
    } catch (error) {
      console.error("Erro ao converter lead em cliente:", error);
      toast.error("Erro ao converter lead em cliente");
      return null;
    }
  }
};
