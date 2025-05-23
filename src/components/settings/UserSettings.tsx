
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotifications } from "@/hooks/useNotifications";

interface UserSettings {
  theme: string;
  notifications_enabled: boolean;
  language: string;
}

const UserSettings = () => {
  const { user, company } = useAuth();
  const { toast } = useToast();
  const { notifySystemEvent } = useNotifications();
  const [settings, setSettings] = useState<UserSettings>({
    theme: "light",
    notifications_enabled: true,
    language: "pt-BR"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadSettings() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", user.id)
          .single();
          
        if (error) {
          if (error.code === "PGRST116") {
            // Não encontrou configurações, criar default
            const { data: newSettings, error: createError } = await supabase
              .from("user_settings")
              .insert({
                user_id: user.id,
                company_id: company?.id,
                theme: "light",
                notifications_enabled: true,
                language: "pt-BR"
              })
              .select("*")
              .single();
              
            if (createError) {
              console.error("Erro ao criar configurações:", createError);
              return;
            }
            
            setSettings(newSettings);
          } else {
            console.error("Erro ao carregar configurações:", error);
          }
        } else {
          setSettings(data);
        }
      } catch (err) {
        console.error("Erro ao carregar configurações:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadSettings();
  }, [user, company]);

  const updateSetting = async (key: keyof UserSettings, value: any) => {
    if (!user) return;
    
    try {
      // Atualização otimista na UI
      setSettings(prev => ({ ...prev, [key]: value }));
      
      // Atualizar no Supabase
      const { error } = await supabase
        .from("user_settings")
        .update({ [key]: value, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Configurações atualizadas",
        description: "Suas preferências foram salvas com sucesso."
      });
      
      // Adicionar notificação sobre a atualização
      await notifySystemEvent(
        "Configurações atualizadas",
        `A configuração ${key} foi atualizada com sucesso.`
      );
      
      // Aplicar tema imediatamente se foi essa a mudança
      if (key === 'theme') {
        document.documentElement.classList.remove('light', 'dark');
        if (value === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (value === 'light') {
          document.documentElement.classList.add('light');
        } else if (value === 'system') {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.classList.add(systemPrefersDark ? 'dark' : 'light');
        }
      }
    } catch (err) {
      console.error(`Erro ao atualizar ${key}:`, err);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar suas configurações.",
        variant: "destructive"
      });
      
      // Reverter mudança em caso de erro
      setSettings(prev => ({ ...prev, [key]: !value }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências do Usuário</CardTitle>
        <CardDescription>Configure suas preferências pessoais</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Tema</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Escolha entre tema claro ou escuro
              </p>
            </div>
            <Select
              value={settings.theme}
              onValueChange={(value) => updateSetting("theme", value)}
              disabled={loading}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Notificações</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Habilitar ou desabilitar notificações
              </p>
            </div>
            <Switch 
              checked={settings.notifications_enabled}
              onCheckedChange={(checked) => updateSetting("notifications_enabled", checked)}
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Idioma</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Escolha seu idioma preferido
              </p>
            </div>
            <Select
              value={settings.language}
              onValueChange={(value) => updateSetting("language", value)}
              disabled={loading}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português</SelectItem>
                <SelectItem value="en-US">English</SelectItem>
                <SelectItem value="es-ES">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSettings;
