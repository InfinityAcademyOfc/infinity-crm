
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface SalesLead {
  id: string;
  company_id: string;
  name: string;
  email?: string;
  phone?: string;
  value: number;
  stage: string;
  priority: string;
  source?: string;
  description?: string;
  assigned_to?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FunnelStage {
  id: string;
  company_id: string;
  name: string;
  order_index: number;
  color: string;
  created_at: string;
}

export const useRealSalesFunnel = () => {
  const { user, company } = useAuth();
  const [leads, setLeads] = useState<SalesLead[]>([]);
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStages = async () => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('funnel_stages')
        .select('*')
        .eq('company_id', company.id)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setStages(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar estágios:', err);
      setError('Erro ao carregar estágios do funil');
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
    } catch (err: any) {
      console.error('Erro ao buscar leads:', err);
      setError('Erro ao carregar leads');
    }
  };

  const createLead = async (leadData: Omit<SalesLead, 'id' | 'created_at' | 'updated_at' | 'company_id'>) => {
    if (!company?.id || !user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('sales_leads')
        .insert([{
          ...leadData,
          company_id: company.id,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setLeads(prev => [data, ...prev]);
      toast.success('Lead criado com sucesso!');
      return data;
    } catch (err: any) {
      console.error('Erro ao criar lead:', err);
      toast.error('Erro ao criar lead');
      return null;
    }
  };

  const updateLead = async (id: string, updates: Partial<SalesLead>) => {
    try {
      const { data, error } = await supabase
        .from('sales_leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setLeads(prev => prev.map(lead => lead.id === id ? data : lead));
      toast.success('Lead atualizado com sucesso!');
      return data;
    } catch (err: any) {
      console.error('Erro ao atualizar lead:', err);
      toast.error('Erro ao atualizar lead');
      return null;
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sales_leads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLeads(prev => prev.filter(lead => lead.id !== id));
      toast.success('Lead removido com sucesso!');
      return true;
    } catch (err: any) {
      console.error('Erro ao deletar lead:', err);
      toast.error('Erro ao remover lead');
      return false;
    }
  };

  const moveLeadToStage = async (leadId: string, newStage: string) => {
    return updateLead(leadId, { stage: newStage });
  };

  useEffect(() => {
    const loadData = async () => {
      if (!company?.id) return;

      setLoading(true);
      setError(null);

      try {
        await Promise.all([fetchStages(), fetchLeads()]);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [company]);

  const getLeadsByStage = (stageName: string) => {
    return leads.filter(lead => lead.stage === stageName);
  };

  const getStageMetrics = () => {
    return stages.map(stage => {
      const stageLeads = getLeadsByStage(stage.name);
      const totalValue = stageLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);
      
      return {
        ...stage,
        count: stageLeads.length,
        totalValue,
        leads: stageLeads
      };
    });
  };

  return {
    leads,
    stages,
    loading,
    error,
    createLead,
    updateLead,
    deleteLead,
    moveLeadToStage,
    getLeadsByStage,
    getStageMetrics,
    refetch: () => Promise.all([fetchStages(), fetchLeads()])
  };
};
