
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSalesFunnelRealtime } from "@/hooks/useSalesFunnelRealtime";
import { SalesFunnelBoard } from "@/components/sales-funnel/SalesFunnelBoard";
import { FunnelStats } from "@/components/sales-funnel/FunnelStats";
import { NewLeadFormDialog } from "@/components/sales-funnel/NewLeadFormDialog";
import { EditLeadDialog } from "@/components/sales-funnel/EditLeadDialog";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3 } from "lucide-react";
import { useState } from "react";

const SalesFunnel = () => {
  const { user, companyProfile } = useAuth();
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [editLeadOpen, setEditLeadOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string>("");

  const companyId = companyProfile?.company_id || user?.id || "";

  const {
    funnelStages,
    salesLeads,
    kanbanColumns,
    handleDragEnd,
    handleCreateLead,
    handleUpdateLead,
    handleDeleteLead,
  } = useSalesFunnelRealtime(companyId);

  const handleAddCard = (columnId: string) => {
    setSelectedColumnId(columnId);
    setNewLeadOpen(true);
  };

  const handleEditCard = (cardId: string) => {
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

  // Wrap handleDeleteLead to match expected signature
  const handleDeleteCardWrapper = (cardId: string) => {
    handleDeleteLead(cardId);
  };

  const totalLeads = salesLeads.length;
  const totalValue = salesLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  const conversionRate = totalLeads > 0 
    ? Math.round((salesLeads.filter(l => l.stage === 'Ganhos').length / totalLeads) * 100)
    : 0;
  const activeStages = funnelStages.length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Funil de Vendas</h1>
          <p className="text-muted-foreground">
            Gerencie seus leads e acompanhe o progresso das vendas
          </p>
        </div>
        
        <Button onClick={() => setNewLeadOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      <FunnelStats
        totalLeads={totalLeads}
        totalValue={totalValue}
        conversionRate={conversionRate}
        activeStages={activeStages}
      />

      <SalesFunnelBoard
        columns={kanbanColumns}
        setColumns={() => {}}
        onAddCard={handleAddCard}
        onEditCard={handleEditCard}
        onDeleteCard={handleDeleteCardWrapper}
      />

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

export default SalesFunnel;
