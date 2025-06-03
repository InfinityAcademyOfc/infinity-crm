
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface SalesLead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  value: number;
  stage: string;
  priority: string;
  source?: string;
  description?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface FunnelStage {
  id: string;
  name: string;
  color: string;
  order_index: number;
  company_id: string;
}

export const useRealSalesFunnel = () => {
  const { company } = useAuth();
  const [leads, setLeads] = useState<SalesLead[]>([]);
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStages = async () => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('funnel_stages')
        .select('*')
        .eq('company_id', company.id)
        .order('order_index');

      if (error) throw error;
      
      if (!data || data.length === 0) {
        // Create default stages if none exist
        await createDefaultStages();
      } else {
        setStages(data);
      }
    } catch (error) {
      console.error('Erro ao buscar estágios do funil:', error);
      toast.error('Erro ao carregar estágios do funil');
    }
  };

  const createDefaultStages = async () => {
    if (!company?.id) return;

    const defaultStages = [
      { name: 'Prospecting', color: '#3b82f6', order_index: 1 },
      { name: 'Qualifying', color: '#f59e0b', order_index: 2 },
      { name: 'Proposal', color: '#8b5cf6', order_index: 3 },
      { name: 'Negotiation', color: '#ef4444', order_index: 4 },
      { name: 'Won', color: '#10b981', order_index: 5 }
    ];

    try {
      const { data, error } = await supabase
        .from('funnel_stages')
        .insert(defaultStages.map(stage => ({
          ...stage,
          company_id: company.id
        })))
        .select();

      if (error) throw error;
      setStages(data);
    } catch (error) {
      console.error('Erro ao criar estágios padrão:', error);
    }
  };

  const fetchLeads = async () => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('sales_leads')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      toast.error('Erro ao carregar leads');
    }
  };

  const moveLeadToStage = async (leadId: string, newStage: string) => {
    try {
      const { error } = await supabase
        .from('sales_leads')
        .update({ stage: newStage })
        .eq('id', leadId);

      if (error) throw error;
      
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, stage: newStage } : lead
      ));
      
      toast.success('Lead movido com sucesso!');
    } catch (error) {
      console.error('Erro ao mover lead:', error);
      toast.error('Erro ao mover lead');
    }
  };

  const deleteLead = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('sales_leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;
      
      setLeads(prev => prev.filter(lead => lead.id !== leadId));
      toast.success('Lead excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      toast.error('Erro ao excluir lead');
    }
  };

  const createLead = async (leadData: Omit<SalesLead, 'id' | 'created_at' | 'updated_at' | 'company_id'>) => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('sales_leads')
        .insert([{
          ...leadData,
          company_id: company.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setLeads(prev => [data, ...prev]);
      toast.success('Lead criado com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      toast.error('Erro ao criar lead');
      throw error;
    }
  };

  useEffect(() => {
    if (company?.id) {
      Promise.all([fetchStages(), fetchLeads()]).finally(() => {
        setLoading(false);
      });
    }
  }, [company]);

  return {
    leads,
    stages,
    loading,
    moveLeadToStage,
    deleteLead,
    createLead,
    refetch: () => Promise.all([fetchStages(), fetchLeads()])
  };
};
