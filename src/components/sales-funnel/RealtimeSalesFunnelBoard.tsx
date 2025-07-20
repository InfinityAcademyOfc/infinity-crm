
import React, { useEffect, useState, useMemo } from "react";
import { DndProvider } from "@/components/ui/dnd-provider";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import NewLeadDialog from "./NewLeadDialog";
import { EditLeadDialog } from "./EditLeadDialog";
import { FunnelHeader } from "./FunnelHeader";
import { FunnelStats } from "./FunnelStats";
import { useSalesFunnelRealtime } from "@/hooks/useSalesFunnelRealtime";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";

const RealtimeSalesFunnelBoard = React.memo(() => {
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
    setKanbanColumns
  } = useSalesFunnelRealtime(companyId);

  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [editLeadOpen, setEditLeadOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Memoized calculations for better performance
  const totalLeads = useMemo(() => salesLeads.length, [salesLeads.length]);
  const totalValue = useMemo(() => 
    salesLeads.reduce((sum, lead) => sum + (lead.value || 0), 0), 
    [salesLeads]
  );
  const activeStages = useMemo(() => funnelStages.length, [funnelStages.length]);

  const refreshData = () => {
    // Data refreshes automatically via real-time subscriptions
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <FunnelHeader 
        showAnalytics={showAnalytics}
        setShowAnalytics={setShowAnalytics}
        filterMenuOpen={filterMenuOpen}
        setFilterMenuOpen={setFilterMenuOpen}
        onAddNewLead={() => setNewLeadOpen(true)}
        onFiltersApplied={refreshData}
      />
      
      <FunnelStats 
        totalLeads={totalLeads}
        totalValue={totalValue}
        conversionRate={0}
        activeStages={activeStages}
      />

      <Card className="flex-1 p-4">
        <DndProvider 
          items={kanbanColumns.map(col => col.id)}
          onDragEnd={(activeId, overId) => {
            // Handle drag end logic
          }}
        >
          <KanbanBoard
            columns={kanbanColumns}
            setColumns={setKanbanColumns}
            onAddCard={() => setNewLeadOpen(true)}
            onEditCard={(card) => {
              setSelectedLead(card);
              setEditLeadOpen(true);
            }}
            onDeleteCard={handleDeleteLead}
          />
        </DndProvider>
      </Card>

      <NewLeadDialog
        open={newLeadOpen}
        onOpenChange={setNewLeadOpen}
        activeColumnId={funnelStages[0]?.id || null}
        onSave={(leadData) => {
          handleCreateLead(leadData, funnelStages[0]?.id || '');
          setNewLeadOpen(false);
        }}
      />

      <EditLeadDialog
        open={editLeadOpen}
        onOpenChange={setEditLeadOpen}
        activeCard={selectedLead}
        funnelStages={funnelStages}
        onUpdate={(updates) => {
          if (selectedLead) {
            handleUpdateLead(selectedLead.id, updates);
            setEditLeadOpen(false);
          }
        }}
      />
    </div>
  );
});

RealtimeSalesFunnelBoard.displayName = 'RealtimeSalesFunnelBoard';

export default RealtimeSalesFunnelBoard;
