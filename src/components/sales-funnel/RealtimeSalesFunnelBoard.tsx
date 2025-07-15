
import React, { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { NewLeadDialog } from "./NewLeadDialog";
import { EditLeadDialog } from "./EditLeadDialog";
import { FunnelHeader } from "./FunnelHeader";
import { FunnelStats } from "./FunnelStats";
import { useSalesFunnelRealtime } from "@/hooks/useSalesFunnelRealtime";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";

const RealtimeSalesFunnelBoard = () => {
  const { user, companyProfile } = useAuth();
  const companyId = companyProfile?.company_id || user?.id || "";
  
  const {
    funnelStages,
    salesLeads,
    kanbanColumns,
    handleDragEnd,
    handleCreateLead,
    handleUpdateLead,
    handleDeleteLead,
    refreshData,
    newLeadOpen,
    setNewLeadOpen,
    editLeadOpen,
    setEditLeadOpen,
    selectedLead,
    setSelectedLead
  } = useSalesFunnelRealtime(companyId);

  useEffect(() => {
    if (companyId) {
      refreshData();
    }
  }, [companyId, refreshData]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <FunnelHeader onRefresh={refreshData} />
      
      <FunnelStats 
        stages={funnelStages}
        leads={salesLeads}
      />

      <Card className="flex-1 p-4">
        <DndProvider backend={HTML5Backend}>
          <KanbanBoard
            columns={kanbanColumns}
            onDragEnd={handleDragEnd}
            onCreateCard={handleCreateLead}
            onEditCard={(card) => {
              setSelectedLead(card);
              setEditLeadOpen(true);
            }}
            onDeleteCard={handleDeleteLead}
            createButtonText="Novo Lead"
          />
        </DndProvider>
      </Card>

      <NewLeadDialog
        open={newLeadOpen}
        onOpenChange={setNewLeadOpen}
        onSave={(leadData, stageId) => handleCreateLead(leadData, stageId)}
        stages={funnelStages}
      />

      <EditLeadDialog
        open={editLeadOpen}
        onOpenChange={setEditLeadOpen}
        lead={selectedLead}
        onSave={(leadId, updates) => handleUpdateLead(leadId, updates)}
        stages={funnelStages}
      />
    </div>
  );
};

export default RealtimeSalesFunnelBoard;
