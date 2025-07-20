
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { funnelService, FunnelStage, SalesLead } from "@/services/api/funnelService";
import { toast } from "sonner";
import { KanbanColumnItem, KanbanCardItem } from "@/components/kanban/types";

export function useSalesFunnelRealtime(companyId: string) {
  const [funnelStages, setFunnelStages] = useState<FunnelStage[]>([]);
  const [salesLeads, setSalesLeads] = useState<SalesLead[]>([]);
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumnItem[]>([]);

  // Load initial data immediately
  useEffect(() => {
    if (!companyId) return;

    const loadData = async () => {
      try {
        console.log('Loading funnel data for company:', companyId);
        
        const [stages, leads] = await Promise.all([
          funnelService.getFunnelStages(companyId),
          funnelService.getSalesLeads(companyId)
        ]);
        
        console.log('Loaded stages:', stages);
        console.log('Loaded leads:', leads);
        
        // Initialize default stages if none exist
        if (stages.length === 0) {
          await funnelService.initializeDefaultStages(companyId);
          const newStages = await funnelService.getFunnelStages(companyId);
          setFunnelStages(newStages);
        } else {
          setFunnelStages(stages);
        }
        
        setSalesLeads(leads);
        
        // Convert to Kanban format
        const stagesToUse = stages.length > 0 ? stages : await funnelService.getFunnelStages(companyId);
        const columns = stagesToUse.map(stage => ({
          id: stage.id,
          title: stage.name,
          color: stage.color,
          cards: leads
            .filter(lead => lead.stage_id === stage.id)
            .map(lead => convertLeadToCard(lead))
        }));
        
        setKanbanColumns(columns);
      } catch (error) {
        console.error("Erro ao carregar dados do funil:", error);
        toast.error("Erro ao carregar dados do funil");
      }
    };

    loadData();
  }, [companyId]);

  // Setup real-time subscriptions
  useEffect(() => {
    if (!companyId) return;

    const leadsChannel = supabase
      .channel('sales_leads_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales_leads',
          filter: `company_id=eq.${companyId}`
        },
        (payload) => {
          console.log('Real-time lead change:', payload);
          handleLeadChange(payload);
        }
      )
      .subscribe();

    const stagesChannel = supabase
      .channel('funnel_stages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'funnel_stages',
          filter: `company_id=eq.${companyId}`
        },
        (payload) => {
          console.log('Real-time stage change:', payload);
          handleStageChange(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(stagesChannel);
    };
  }, [companyId]);

  const handleLeadChange = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    setSalesLeads(current => {
      let updated = [...current];
      
      switch (eventType) {
        case 'INSERT':
          updated = [...current, newRecord];
          break;
        case 'UPDATE':
          updated = current.map(lead => 
            lead.id === newRecord.id ? newRecord : lead
          );
          break;
        case 'DELETE':
          updated = current.filter(lead => lead.id !== oldRecord.id);
          break;
        default:
          return current;
      }
      
      // Update kanban columns immediately
      setTimeout(() => updateKanbanFromLeads(updated), 0);
      return updated;
    });
  };

  const handleStageChange = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    setFunnelStages(current => {
      switch (eventType) {
        case 'INSERT':
          return [...current, newRecord].sort((a, b) => a.order_index - b.order_index);
        case 'UPDATE':
          return current.map(stage => 
            stage.id === newRecord.id ? newRecord : stage
          );
        case 'DELETE':
          return current.filter(stage => stage.id !== oldRecord.id);
        default:
          return current;
      }
    });
  };

  const updateKanbanFromLeads = (leads: SalesLead[]) => {
    setKanbanColumns(current => {
      return current.map(column => ({
        ...column,
        cards: leads
          .filter(lead => lead.stage_id === column.id)
          .map(lead => convertLeadToCard(lead))
      }));
    });
  };

  const convertLeadToCard = (lead: SalesLead): KanbanCardItem => ({
    id: lead.id,
    title: lead.name,
    description: lead.description || '',
    value: lead.value || 0,
    priority: lead.priority as "low" | "medium" | "high",
    assignedTo: lead.assigned_to ? {
      id: lead.assigned_to,
      name: 'Usuário',
      avatar: '/placeholder.svg'
    } : undefined,
    tags: [
      ...(lead.source ? [{ label: lead.source, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' }] : []),
      ...(lead.priority ? [{ label: lead.priority, color: getPriorityColor(lead.priority) }] : [])
    ],
    metadata: {
      value: lead.value ? `R$ ${lead.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : undefined,
      assignee: lead.assigned_to,
      date: new Date(lead.created_at).toLocaleDateString('pt-BR')
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleDragEnd = async (cardId: string, sourceColumnId: string, targetColumnId: string) => {
    if (sourceColumnId === targetColumnId) return;

    const targetStage = funnelStages.find(stage => stage.id === targetColumnId);
    if (!targetStage) return;

    const success = await funnelService.updateLeadStage(cardId, targetColumnId, targetStage.name);
    
    if (success) {
      toast.success(`Lead movido para ${targetStage.name}`, { duration: 2000 });
    } else {
      toast.error("Erro ao mover lead");
    }
  };

  const handleCreateLead = async (leadData: any, stageId: string) => {
    const stage = funnelStages.find(s => s.id === stageId);
    const newLead = await funnelService.createLead({
      ...leadData,
      company_id: companyId,
      stage_id: stageId,
      stage: stage?.name || 'Prospecção'
    });

    if (newLead) {
      toast.success(`${leadData.name} foi adicionado ao funil`, { duration: 2000 });
    } else {
      toast.error("Erro ao criar lead");
    }
  };

  const handleUpdateLead = async (leadId: string, updates: Partial<SalesLead>) => {
    const updatedLead = await funnelService.updateLead(leadId, updates);
    
    if (updatedLead) {
      toast.success("Lead atualizado com sucesso", { duration: 2000 });
    } else {
      toast.error("Erro ao atualizar lead");
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    const success = await funnelService.deleteLead(leadId);
    
    if (success) {
      toast.success("Lead removido do funil", { duration: 2000 });
    } else {
      toast.error("Erro ao remover lead");
    }
  };

  return {
    funnelStages,
    salesLeads,
    kanbanColumns,
    handleDragEnd,
    handleCreateLead,
    handleUpdateLead,
    handleDeleteLead,
    setKanbanColumns
  };
}
