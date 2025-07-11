
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Settings, Save } from 'lucide-react';

interface WidgetConfig {
  id: string;
  name: string;
  enabled: boolean;
  size: 'small' | 'medium' | 'large';
  position: number;
}

const DashboardWidgetConfig = () => {
  const { user, company } = useAuth();
  const { toast } = useToast();
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    { id: 'leads', name: 'Total de Leads', enabled: true, size: 'medium', position: 1 },
    { id: 'clients', name: 'Clientes Ativos', enabled: true, size: 'medium', position: 2 },
    { id: 'revenue', name: 'Receita Total', enabled: true, size: 'medium', position: 3 },
    { id: 'tasks', name: 'Tarefas Concluídas', enabled: true, size: 'medium', position: 4 },
    { id: 'funnel', name: 'Etapas do Funil', enabled: true, size: 'small', position: 5 },
    { id: 'conversion', name: 'Taxa de Conversão', enabled: true, size: 'small', position: 6 },
    { id: 'growth', name: 'Crescimento Mensal', enabled: true, size: 'small', position: 7 },
    { id: 'source', name: 'Melhor Fonte', enabled: true, size: 'small', position: 8 }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadConfiguration();
  }, [user?.id]);

  const loadConfiguration = async () => {
    if (!user?.id) return;

    try {
      const { data } = await supabase
        .from('dashboard_configurations')
        .select('widget_preferences')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data?.widget_preferences) {
        try {
          const savedWidgets = data.widget_preferences as unknown as WidgetConfig[];
          if (Array.isArray(savedWidgets)) {
            setWidgets(savedWidgets);
          }
        } catch (error) {
          console.error('Erro ao parsear widget_preferences:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const saveConfiguration = async () => {
    if (!user?.id || !company?.id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('dashboard_configurations')
        .upsert({
          user_id: user.id,
          company_id: company.id,
          widget_preferences: widgets as unknown as any,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Configurações salvas',
        description: 'Suas preferências de dashboard foram atualizadas com sucesso.'
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateWidget = (id: string, updates: Partial<WidgetConfig>) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, ...updates } : widget
    ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <CardTitle>Configuração de Widgets</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {widgets.map(widget => (
            <div key={widget.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Switch
                  checked={widget.enabled}
                  onCheckedChange={(enabled) => updateWidget(widget.id, { enabled })}
                />
                <Label className="font-medium">{widget.name}</Label>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">Tamanho:</Label>
                  <Select 
                    value={widget.size} 
                    onValueChange={(size: 'small' | 'medium' | 'large') => 
                      updateWidget(widget.id, { size })
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Pequeno</SelectItem>
                      <SelectItem value="medium">Médio</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={saveConfiguration} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardWidgetConfig;
