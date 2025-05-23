import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GripVertical, Bookmark, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { settingsService, DashboardConfig } from "@/services/settings";
import { supabase } from "@/lib/supabase";

type ChartConfig = {
  id: string;
  title: string;
  enabled: boolean;
  type: string;
  order: number;
};

const defaultCharts: ChartConfig[] = [
  { id: "sales-funnel", title: "Funil de Vendas", enabled: true, type: "funnel", order: 0 },
  { id: "revenue", title: "Receita Mensal", enabled: true, type: "bar", order: 1 },
  { id: "leads-source", title: "Origem dos Leads", enabled: true, type: "pie", order: 2 },
  { id: "tasks", title: "Tarefas por Status", enabled: true, type: "bar", order: 3 },
  { id: "conversion-rate", title: "Taxa de Conversão", enabled: false, type: "line", order: 4 },
  { id: "client-activity", title: "Atividade de Clientes", enabled: false, type: "line", order: 5 },
];

const DashboardSettings = () => {
  const [charts, setCharts] = useState<ChartConfig[]>(defaultCharts);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const loadDashboardConfig = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("user_settings")
          .select("dashboard_config")
          .eq("user_id", user.id)
          .single();
          
        if (error) {
          if (error.code !== "PGRST116") { // No rows found
            throw error;
          }
          // Use defaults if no record found
        } else if (data?.dashboard_config?.charts) {
          setCharts(data.dashboard_config.charts);
        }
      } catch (error) {
        console.error("Error loading dashboard config:", error);
        toast.error("Não foi possível carregar suas configurações de dashboard");
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardConfig();
  }, [user]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(charts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order values
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));
    
    setCharts(updatedItems);
  };

  const toggleChart = (id: string) => {
    setCharts(charts.map(chart => 
      chart.id === id ? { ...chart, enabled: !chart.enabled } : chart
    ));
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      const config: DashboardConfig = {
        charts: charts
      };
      
      const success = await settingsService.saveDashboardConfig(user.id, config);
      
      if (success) {
        toast.success("Configurações do dashboard salvas com sucesso");
      }
    } catch (error) {
      console.error("Error saving dashboard config:", error);
      toast.error("Não foi possível salvar suas configurações de dashboard");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

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
                          disabled={saving}
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
        
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full sm:w-auto"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : "Salvar Preferências"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardSettings;
