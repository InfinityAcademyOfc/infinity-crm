
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bell, Save } from "lucide-react";

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  frequency?: 'instant' | 'daily' | 'weekly';
  channels?: string[];
}

const NotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'new_leads',
      label: 'Novos leads',
      description: 'Receba notificações quando novos leads forem adicionados',
      enabled: true,
      frequency: 'instant',
      channels: ['app', 'email']
    },
    {
      id: 'client_activities',
      label: 'Atividades de clientes',
      description: 'Receba notificações sobre atividades de clientes',
      enabled: true,
      frequency: 'daily',
      channels: ['app']
    },
    {
      id: 'payments',
      label: 'Pagamentos',
      description: 'Notificações sobre pagamentos recebidos ou pendentes',
      enabled: false,
      frequency: 'instant',
      channels: ['app', 'email']
    },
    {
      id: 'meeting_reminders',
      label: 'Lembretes de reuniões',
      description: 'Receba lembretes antes das reuniões agendadas',
      enabled: true,
      frequency: 'instant',
      channels: ['app', 'email']
    },
    {
      id: 'task_deadlines',
      label: 'Prazos de tarefas',
      description: 'Alertas sobre tarefas próximas do prazo',
      enabled: true,
      frequency: 'daily',
      channels: ['app']
    },
    {
      id: 'system_updates',
      label: 'Atualizações do sistema',
      description: 'Informações sobre novas funcionalidades e manutenções',
      enabled: false,
      frequency: 'weekly',
      channels: ['email']
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, [user?.id]);

  const loadPreferences = async () => {
    if (!user?.id) return;

    try {
      const { data } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        // Mapear dados do banco para o formato do componente
        setPreferences(prev => prev.map(pref => ({
          ...pref,
          enabled: data[pref.id] ?? pref.enabled
        })));
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
  };

  const savePreferences = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const preferencesData = preferences.reduce((acc, pref) => ({
        ...acc,
        [pref.id]: pref.enabled
      }), {});

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...preferencesData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Preferências salvas',
        description: 'Suas configurações de notificação foram atualizadas.'
      });
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as preferências.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreference = (id: string, updates: Partial<NotificationPreference>) => {
    setPreferences(prev => prev.map(pref => 
      pref.id === id ? { ...pref, ...updates } : pref
    ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <CardTitle>Preferências de Notificação</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {preferences.map(pref => (
            <div key={pref.id} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={pref.enabled}
                      onCheckedChange={(enabled) => updatePreference(pref.id, { enabled })}
                    />
                    <Label className="font-medium">{pref.label}</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">{pref.description}</p>
                </div>
              </div>
              
              {pref.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t">
                  <div className="space-y-2">
                    <Label className="text-sm">Frequência</Label>
                    <Select 
                      value={pref.frequency} 
                      onValueChange={(frequency: 'instant' | 'daily' | 'weekly') => 
                        updatePreference(pref.id, { frequency })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instant">Instantâneo</SelectItem>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Canais</Label>
                    <div className="flex gap-2">
                      {['app', 'email'].map(channel => (
                        <div key={channel} className="flex items-center gap-1">
                          <Switch
                            size="sm"
                            checked={pref.channels?.includes(channel)}
                            onCheckedChange={(checked) => {
                              const channels = pref.channels || [];
                              const newChannels = checked 
                                ? [...channels, channel]
                                : channels.filter(c => c !== channel);
                              updatePreference(pref.id, { channels: newChannels });
                            }}
                          />
                          <Label className="text-xs capitalize">{channel}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={savePreferences} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Salvando...' : 'Salvar Preferências'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
