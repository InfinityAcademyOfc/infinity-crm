
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreVertical, User, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { useRealSalesFunnel } from '@/hooks/useRealSalesFunnel';
import LeadFormDialog from '@/components/forms/LeadFormDialog';
import { toast } from 'sonner';

const SalesFunnelBoard = () => {
  const { stages, leads, loading, moveLeadToStage, deleteLead, refetch } = useRealSalesFunnel();
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [activeStageId, setActiveStageId] = useState<string>('');

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando funil de vendas...</p>
        </div>
      </div>
    );
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const leadId = draggableId;
    const newStage = destination.droppableId;

    try {
      await moveLeadToStage(leadId, newStage);
    } catch (error) {
      console.error('Erro ao mover lead:', error);
      toast.error('Erro ao mover lead');
    }
  };

  const handleAddLead = (stageId: string) => {
    setActiveStageId(stageId);
    setIsAddLeadOpen(true);
  };

  const handleLeadSuccess = () => {
    refetch();
    setIsAddLeadOpen(false);
  };

  const getLeadsByStage = (stageId: string) => {
    return leads.filter(lead => lead.stage === stageId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Funil de Vendas</h2>
          <p className="text-muted-foreground">
            Gerencie seus leads através do pipeline de vendas
          </p>
        </div>
        <Button onClick={() => handleAddLead('new')}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stages.map((stage) => {
            const stageLeads = getLeadsByStage(stage.id);
            const stageValue = stageLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);

            return (
              <div key={stage.id} className="min-h-[600px]">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium" style={{ color: stage.color }}>
                        {stage.name}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddLead(stage.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stageLeads.length} lead(s) • {formatCurrency(stageValue)}
                    </div>
                  </CardHeader>

                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <CardContent
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`space-y-2 min-h-[400px] ${
                          snapshot.isDraggingOver ? 'bg-muted/50' : ''
                        }`}
                      >
                        {stageLeads.map((lead, index) => (
                          <Draggable key={lead.id} draggableId={lead.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-move ${
                                  snapshot.isDragging ? 'shadow-lg' : ''
                                }`}
                              >
                                <div className="space-y-2">
                                  <div className="flex items-start justify-between">
                                    <h4 className="font-medium text-sm line-clamp-2">
                                      {lead.name}
                                    </h4>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                    >
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </div>

                                  <div className="space-y-1">
                                    {lead.value && (
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <DollarSign className="h-3 w-3 mr-1" />
                                        {formatCurrency(lead.value)}
                                      </div>
                                    )}

                                    {lead.assigned_to && (
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <User className="h-3 w-3 mr-1" />
                                        Responsável
                                      </div>
                                    )}

                                    {lead.due_date && (
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {new Date(lead.due_date).toLocaleDateString()}
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <Badge
                                      variant="secondary"
                                      className={`text-xs ${getPriorityColor(lead.priority)}`}
                                    >
                                      {lead.priority === 'high' ? 'Alta' : 
                                       lead.priority === 'medium' ? 'Média' : 'Baixa'}
                                    </Badge>

                                    {lead.source && (
                                      <span className="text-xs text-muted-foreground">
                                        {lead.source}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        {stageLeads.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <p className="text-sm">Nenhum lead nesta etapa</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2"
                              onClick={() => handleAddLead(stage.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Adicionar Lead
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Droppable>
                </Card>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <LeadFormDialog
        open={isAddLeadOpen}
        onOpenChange={setIsAddLeadOpen}
        onSuccess={handleLeadSuccess}
        columnId={activeStageId}
      />
    </div>
  );
};

export default SalesFunnelBoard;
