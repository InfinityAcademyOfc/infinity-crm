
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
        const [stages, leads] = await Promise.all([
          funnelService.getFunnelStages(companyId),
          funnelService.getSalesLeads(companyId)
        ]);
        
        setFunnelStages(stages);
        setSalesLeads(leads);
        
        // Convert to Kanban format
        const columns = stages.map(stage => ({
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
          handleLeadChange(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
    };
  }, [companyId]);

  const handleLeadChange = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    setSalesLeads(current => {
      switch (eventType) {
        case 'INSERT':
          return [...current, newRecord];
        case 'UPDATE':
          return current.map(lead => 
            lead.id === newRecord.id ? newRecord : lead
          );
        case 'DELETE':
          return current.filter(lead => lead.id !== oldRecord.id);
        default:
          return current;
      }
    });

    // Update kanban columns immediately
    setTimeout(updateKanbanFromLeads, 0);
  };

  const updateKanbanFromLeads = () => {
    setKanbanColumns(current => {
      return current.map(column => ({
        ...column,
        cards: salesLeads
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
    const newLead = await funnelService.createLead({
      ...leadData,
      company_id: companyId,
      stage_id: stageId,
      stage: funnelStages.find(s => s.id === stageId)?.name || 'Prospecção'
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
