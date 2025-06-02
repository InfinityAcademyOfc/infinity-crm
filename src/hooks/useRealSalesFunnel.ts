
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { leadService } from '@/services/api/leadService';

export interface SalesLead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  description: string | null;
  source: string | null;
  priority: 'low' | 'medium' | 'high';
  stage: string;
  value: number;
  assigned_to: string | null;
  due_date: string | null;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface FunnelStage {
  id: string;
  name: string;
  color: string;
  order: number;
  company_id: string;
}

export const useRealSalesFunnel = () => {
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [leads, setLeads] = useState<SalesLead[]>([]);
  const [loading, setLoading] = useState(true);
  const { company } = useAuth();

  const fetchStages = async () => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('funnel_stages')
        .select('*')
        .eq('company_id', company.id)
        .order('order', { ascending: true });

      if (error) {
        console.error('Erro ao buscar estágios:', error);
        // Create default stages if none exist
        await createDefaultStages();
        return;
      }

      setStages(data || []);
    } catch (error) {
      console.error('Erro ao buscar estágios:', error);
      await createDefaultStages();
    }
  };

  const createDefaultStages = async () => {
    if (!company?.id) return;

    const defaultStages = [
      { name: 'Prospects', color: '#ef4444', order: 1 },
      { name: 'Qualificados', color: '#f59e0b', order: 2 },
      { name: 'Proposta', color: '#3b82f6', order: 3 },
      { name: 'Negociação', color: '#8b5cf6', order: 4 },
      { name: 'Fechado - Ganho', color: '#10b981', order: 5 },
      { name: 'Fechado - Perdido', color: '#6b7280', order: 6 }
    ];

    try {
      const { data, error } = await supabase
        .from('funnel_stages')
        .insert(defaultStages.map(stage => ({
          ...stage,
          company_id: company.id
        })))
        .select();

      if (error) {
        console.error('Erro ao criar estágios padrão:', error);
        return;
      }

      setStages(data || []);
    } catch (error) {
      console.error('Erro ao criar estágios padrão:', error);
    }
  };

  const fetchLeads = async () => {
    if (!company?.id) return;

    try {
      const leadsData = await leadService.getLeads(company.id);
      const transformedLeads: SalesLead[] = leadsData.map(lead => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        description: lead.description,
        source: lead.source,
        priority: lead.priority,
        stage: lead.status, // Map status to stage
        value: lead.value || 0,
        assigned_to: lead.assigned_to,
        due_date: lead.due_date,
        company_id: lead.company_id,
        created_at: lead.created_at,
        updated_at: lead.updated_at
      }));
      
      setLeads(transformedLeads);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      toast.error('Erro ao carregar leads');
    }
  };

  const createLead = async (leadData: Omit<SalesLead, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    if (!company?.id) {
      toast.error('Empresa não encontrada');
      return null;
    }

    try {
      const newLead = await leadService.createLead({
        title: leadData.name,
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        description: leadData.description,
        source: leadData.source,
        priority: leadData.priority,
        status: 'new',
        value: leadData.value,
        assigned_to: leadData.assigned_to,
        due_date: leadData.due_date,
        company_id: company.id
      });

      if (newLead) {
        const transformedLead: SalesLead = {
          id: newLead.id,
          name: newLead.name,
          email: newLead.email,
          phone: newLead.phone,
          description: newLead.description,
          source: newLead.source,
          priority: newLead.priority,
          stage: newLead.status,
          value: newLead.value || 0,
          assigned_to: newLead.assigned_to,
          due_date: newLead.due_date,
          company_id: newLead.company_id,
          created_at: newLead.created_at,
          updated_at: newLead.updated_at
        };

        setLeads(prev => [transformedLead, ...prev]);
        return transformedLead;
      }
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      toast.error('Erro ao criar lead');
    }

    return null;
  };

  const moveLeadToStage = async (leadId: string, newStage: string) => {
    try {
      const updatedLead = await leadService.updateLead(leadId, { 
        status: newStage as any 
      });

      if (updatedLead) {
        setLeads(prev => prev.map(lead => 
          lead.id === leadId 
            ? { ...lead, stage: newStage }
            : lead
        ));
        toast.success('Lead movido com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao mover lead:', error);
      toast.error('Erro ao mover lead');
    }
  };

  const deleteLead = async (leadId: string) => {
    try {
      const success = await leadService.deleteLead(leadId);
      if (success) {
        setLeads(prev => prev.filter(lead => lead.id !== leadId));
      }
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      toast.error('Erro ao excluir lead');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchStages();
      await fetchLeads();
      setLoading(false);
    };

    loadData();
  }, [company?.id]);

  return {
    stages,
    leads,
    loading,
    createLead,
    moveLeadToStage,
    deleteLead,
    refetch: () => {
      fetchStages();
      fetchLeads();
    }
  };
};
