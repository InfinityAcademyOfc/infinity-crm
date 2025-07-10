
import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useSalesFunnelRealtime } from "@/hooks/useSalesFunnelRealtime";
import { DraggableKanbanBoard } from "./DraggableKanbanBoard";
import { NewLeadFormDialog } from "./NewLeadFormDialog";
import { EditLeadDialog } from "./EditLeadDialog";
import { FunnelAnalytics } from "./FunnelAnalytics";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const RealtimeSalesFunnelBoard = () => {
  const { user } = useAuthContext();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [editLeadOpen, setEditLeadOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string>("");

  // Mock company ID - in real app, get from user context
  const companyId = user?.id || "default-company";

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

  // Prepare analytics data
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesLeads.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Potencial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {salesLeads.reduce((sum, lead) => sum + (lead.value || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {salesLeads.length > 0 
                ? `${Math.round((salesLeads.filter(l => l.stage === 'Ganhos').length / salesLeads.length) * 100)}%`
                : '0%'
              }
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Etapas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{funnelStages.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <Card>
        <CardContent className="p-6">
          <DraggableKanbanBoard
            columns={kanbanColumns}
            onDragEnd={handleDragEnd}
            onAddCard={handleAddCard}
            onEditCard={handleEditCard}
            onDeleteCard={handleDeleteLead}
          />
        </CardContent>
      </Card>

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
