
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface NotificationPreferences {
  new_leads: boolean;
  client_activities: boolean;
  payments: boolean;
  meeting_reminders: boolean;
  email_alerts: boolean;
}

const NotificationSettings = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    new_leads: true,
    client_activities: true,
    payments: false,
    meeting_reminders: true,
    email_alerts: false
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    const loadPreferences = async () => {
      try {
        setLoading(true);
        
        // Fetch notification preferences
        const { data, error } = await supabase
          .from("notification_preferences")
          .select("*")
          .eq("user_id", user.id)
          .single();
          
        if (error) {
          if (error.code !== "PGRST116") { // No rows found
            throw error;
          }
          // Use defaults if no record found
        } else if (data) {
          setPreferences({
            new_leads: data.new_leads ?? true,
            client_activities: data.client_activities ?? true,
            payments: data.payments ?? false,
            meeting_reminders: data.meeting_reminders ?? true,
            email_alerts: data.email_alerts ?? false
          });
        }
      } catch (error) {
        console.error("Error loading notification preferences:", error);
        toast.error("Não foi possível carregar suas preferências de notificação");
      } finally {
        setLoading(false);
      }
    };
    
    loadPreferences();
  }, [user]);
  
  const handleToggle = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };
  
  const savePreferences = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      // Check if record exists
      const { data: existing } = await supabase
        .from("notification_preferences")
        .select("id")
        .eq("user_id", user.id)
        .single();
      
      if (existing) {
        // Update
        const { error } = await supabase
          .from("notification_preferences")
          .update(preferences)
          .eq("user_id", user.id);
          
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from("notification_preferences")
          .insert({
            user_id: user.id,
            ...preferences
          });
          
        if (error) throw error;
      }
      
      toast.success("Preferências de notificação salvas com sucesso");
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      toast.error("Não foi possível salvar suas preferências de notificação");
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
        <CardTitle>Preferências de Notificação</CardTitle>
        <CardDescription>Controle os tipos de notificações que deseja receber</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Novos leads</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receba notificações quando novos leads forem adicionados
              </p>
            </div>
            <Switch 
              checked={preferences.new_leads} 
              onCheckedChange={(checked) => handleToggle("new_leads", checked)}
              disabled={saving}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Atividades de clientes</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receba notificações sobre atividades de clientes
              </p>
            </div>
            <Switch 
              checked={preferences.client_activities} 
              onCheckedChange={(checked) => handleToggle("client_activities", checked)}
              disabled={saving}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Pagamentos</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Notificações sobre pagamentos recebidos ou pendentes
              </p>
            </div>
            <Switch 
              checked={preferences.payments} 
              onCheckedChange={(checked) => handleToggle("payments", checked)}
              disabled={saving}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Lembretes de reuniões</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receba lembretes antes das reuniões agendadas
              </p>
            </div>
            <Switch 
              checked={preferences.meeting_reminders} 
              onCheckedChange={(checked) => handleToggle("meeting_reminders", checked)}
              disabled={saving}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alertas por email</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receba cópias das notificações por email
              </p>
            </div>
            <Switch 
              checked={preferences.email_alerts} 
              onCheckedChange={(checked) => handleToggle("email_alerts", checked)}
              disabled={saving}
            />
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button 
            onClick={savePreferences} 
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : "Salvar Preferências"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
