
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GripVertical, Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ChartConfig = {
  id: string;
  title: string;
  enabled: boolean;
  type: string;
};

const defaultCharts: ChartConfig[] = [
  { id: "sales-funnel", title: "Funil de Vendas", enabled: true, type: "funnel" },
  { id: "revenue", title: "Receita Mensal", enabled: true, type: "bar" },
  { id: "leads-source", title: "Origem dos Leads", enabled: true, type: "pie" },
  { id: "tasks", title: "Tarefas por Status", enabled: true, type: "bar" },
  { id: "conversion-rate", title: "Taxa de Conversão", enabled: false, type: "line" },
  { id: "client-activity", title: "Atividade de Clientes", enabled: false, type: "line" },
];

const DashboardSettings = () => {
  const [charts, setCharts] = useState<ChartConfig[]>(defaultCharts);
  const { toast } = useToast();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(charts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setCharts(items);
  };

  const toggleChart = (id: string) => {
    setCharts(charts.map(chart => 
      chart.id === id ? { ...chart, enabled: !chart.enabled } : chart
    ));
  };

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências de dashboard foram atualizadas com sucesso."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalizar Dashboard</CardTitle>
        <CardDescription>
          Configure quais gráficos e métricas serão exibidos no seu dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Arraste para reordenar e ative/desative os gráficos que deseja visualizar no seu dashboard.
        </p>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="charts">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {charts.map((chart, index) => (
                  <Draggable key={chart.id} draggableId={chart.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center justify-between p-3 border rounded-md bg-background"
                      >
                        <div className="flex items-center gap-3">
                          <div {...provided.dragHandleProps} className="cursor-grab">
                            <GripVertical size={16} className="text-muted-foreground" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Bookmark size={16} className="text-primary" />
                            <span>{chart.title}</span>
                            <span className="text-xs text-muted-foreground ml-1">({chart.type})</span>
                          </div>
                        </div>
                        <Switch 
                          checked={chart.enabled}
                          onCheckedChange={() => toggleChart(chart.id)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        <Button onClick={handleSave}>Salvar Preferências</Button>
      </CardContent>
    </Card>
  );
};

export default DashboardSettings;
