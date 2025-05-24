
import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Phone, Mail, DollarSign, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRealSalesFunnel, SalesLead, FunnelStage } from '@/hooks/useRealSalesFunnel';
import { cn } from '@/lib/utils';

interface RealSalesFunnelBoardProps {
  stages: FunnelStage[];
  leads: SalesLead[];
  searchQuery: string;
}

export const RealSalesFunnelBoard = ({ stages, leads, searchQuery }: RealSalesFunnelBoardProps) => {
  const { moveLeadToStage, deleteLead } = useRealSalesFunnel();

  const getLeadsByStage = (stageName: string) => {
    return leads.filter(lead => lead.stage === stageName);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStage = destination.droppableId;

    await moveLeadToStage(draggableId, newStage);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  if (stages.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CardContent>
          <p className="text-muted-foreground">Nenhum estágio configurado para o funil</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 min-h-[600px]">
        {stages.map((stage) => {
          const stageLeads = getLeadsByStage(stage.name);
          const stageValue = stageLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);

          return (
            <Card key={stage.id} className="flex flex-col">
              <CardHeader 
                className="pb-3"
                style={{ borderTop: `4px solid ${stage.color}` }}
              >
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>{stage.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {stageLeads.length}
                  </Badge>
                </CardTitle>
                <div className="text-xs text-muted-foreground">
                  R$ {stageValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </CardHeader>

              <Droppable droppableId={stage.name}>
                {(provided, snapshot) => (
                  <CardContent
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 space-y-2 p-3",
                      snapshot.isDraggingOver && "bg-muted/50"
                    )}
                    style={{ minHeight: '200px' }}
                  >
                    {stageLeads.map((lead, index) => (
                      <Draggable
                        key={lead.id}
                        draggableId={lead.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "cursor-grab active:cursor-grabbing hover:shadow-md transition-all",
                              snapshot.isDragging && "rotate-2 shadow-lg"
                            )}
                          >
                            <CardContent className="p-3 space-y-2">
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-sm leading-tight">{lead.name}</h4>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Phone className="h-4 w-4 mr-2" />
                                      Ligar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Mail className="h-4 w-4 mr-2" />
                                      Email
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="text-destructive"
                                      onClick={() => deleteLead(lead.id)}
                                    >
                                      Excluir
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              {lead.email && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  <span className="truncate">{lead.email}</span>
                                </div>
                              )}

                              {lead.phone && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Phone className="h-3 w-3" />
                                  {lead.phone}
                                </div>
                              )}

                              {lead.value > 0 && (
                                <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                                  <DollarSign className="h-3 w-3" />
                                  R$ {lead.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <Badge 
                                  variant={getPriorityColor(lead.priority)} 
                                  className="text-xs"
                                >
                                  {getPriorityLabel(lead.priority)}
                                </Badge>

                                {lead.source && (
                                  <Badge variant="outline" className="text-xs">
                                    {lead.source}
                                  </Badge>
                                )}
                              </div>

                              {lead.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {lead.description}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {stageLeads.length === 0 && (
                      <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                        Arraste leads aqui
                      </div>
                    )}
                  </CardContent>
                )}
              </Droppable>
            </Card>
          );
        })}
      </div>
    </DragDropContext>
  );
};
