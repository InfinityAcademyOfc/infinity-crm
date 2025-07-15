
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSalesFunnelRealtime } from "@/hooks/useSalesFunnelRealtime";
import { NewLeadFormDialog } from "./NewLeadFormDialog";
import { EditLeadDialog } from "./EditLeadDialog";
import { FunnelAnalytics } from "./FunnelAnalytics";
import { FunnelBoard } from "./FunnelBoard";
import { FunnelStats } from "./FunnelStats";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3 } from "lucide-react";

export const RealtimeSalesFunnelBoard = () => {
  const { user, companyProfile } = useAuth();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [editLeadOpen, setEditLeadOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string>("");

  const companyId = companyProfile?.company_id || user?.id || "default-company";

  const {
    funnelStages,
    salesLeads,
    kanbanColumns,
    loading,
    handleDragEnd,
    handleCreateLead,
    handleUpdateLead,
    handleDeleteLead,
  } = useSalesFunnelRealtime(companyId);

  const handleAddCard = (columnId: string) => {
    setSelectedColumnId(columnId);
    setNewLeadOpen(true);
  };

  const handleEditCard = (cardId: string, columnId: string) => {
    const lead = salesLeads.find(l => l.id === cardId);
    if (lead) {
      setSelectedCard(lead);
      setEditLeadOpen(true);
    }
  };

  const handleSaveNewLead = (leadData: any, stageId: string) => {
    handleCreateLead(leadData, stageId);
  };

  const handleUpdateExistingLead = (updatedData: any) => {
    if (selectedCard) {
      handleUpdateLead(selectedCard.id, updatedData);
      setSelectedCard(null);
    }
  };

  // Wrapper function to match the expected signature for drag end
  const handleDragEndWrapper = (result: any) => {
    if (result.destination) {
      handleDragEnd(
        result.draggableId,
        result.source.droppableId,
        result.destination.droppableId
      );
    }
  };

  const funnelStageData = funnelStages.map(stage => ({
    name: stage.name,
    value: salesLeads.filter(lead => lead.stage_id === stage.id).length
  }));

  const valuePotentialData = funnelStages.map(stage => ({
    name: stage.name,
    value: salesLeads
      .filter(lead => lead.stage_id === stage.id)
      .reduce((sum, lead) => sum + (lead.value || 0), 0)
  }));

  const totalLeads = salesLeads.length;
  const totalValue = salesLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  const conversionRate = totalLeads > 0 
    ? Math.round((salesLeads.filter(l => l.stage === 'Ganhos').length / totalLeads) * 100)
    : 0;
  const activeStages = funnelStages.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando funil de vendas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Funil de Vendas</h1>
          <p className="text-muted-foreground">
            Gerencie seus leads e acompanhe o progresso das vendas
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {showAnalytics ? 'Ocultar' : 'Mostrar'} Analytics
          </Button>
          
          <Button onClick={() => setNewLeadOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Analytics */}
      {showAnalytics && (
        <FunnelAnalytics 
          funnelStageData={funnelStageData}
          valuePotentialData={valuePotentialData}
        />
      )}

      {/* Statistics Cards */}
      <FunnelStats
        totalLeads={totalLeads}
        totalValue={totalValue}
        conversionRate={conversionRate}
        activeStages={activeStages}
      />

      {/* Kanban Board */}
      <FunnelBoard
        kanbanColumns={kanbanColumns}
        onDragEnd={handleDragEndWrapper}
        onAddCard={handleAddCard}
        onEditCard={handleEditCard}
        onDeleteCard={handleDeleteLead}
      />

      {/* Dialogs */}
      <NewLeadFormDialog
        open={newLeadOpen}
        onOpenChange={setNewLeadOpen}
        funnelStages={funnelStages}
        onSave={handleSaveNewLead}
      />

      <EditLeadDialog
        open={editLeadOpen}
        onOpenChange={setEditLeadOpen}
        activeCard={selectedCard}
        funnelStages={funnelStages}
        onUpdate={handleUpdateExistingLead}
      />
    </div>
  );
};
