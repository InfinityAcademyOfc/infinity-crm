
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface UserSettings {
  user_id: string;
  theme: string;
  notifications_enabled: boolean;
  language: string;
}

const UserSettings = () => {
  const { user, company } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    user_id: user?.id || '',
    theme: "light",
    notifications_enabled: true,
    language: "pt-BR"
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function loadSettings() {
      try {
        setLoading(true);
        // Mock settings for now - replace with actual DB call when settings table exists
        const mockSettings = {
          user_id: user.id,
          theme: "light",
          notifications_enabled: true,
          language: "pt-BR"
        };
        setSettings(mockSettings);
      } catch (err) {
        console.error("Erro ao carregar configurações:", err);
        toast.error("Não foi possível carregar suas configurações");
      } finally {
        setLoading(false);
      }
    }
    
    loadSettings();
  }, [user, company]);

  const updateSetting = async (key: keyof UserSettings, value: any) => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      // Atualização otimista na UI
      setSettings(prev => ({ ...prev, [key]: value }));
      
      // TODO: Implement actual database update when settings table exists
      
      toast.success("Configurações atualizadas");
      
      // Aplicar tema imediatamente se foi essa a mudança
      if (key === 'theme') {
        document.documentElement.classList.toggle('dark', value === 'dark');
      }
    } catch (err) {
      console.error(`Erro ao atualizar ${key}:`, err);
      toast.error("Não foi possível atualizar suas configurações");
      
      // Reverter mudança em caso de erro
      setSettings(prev => ({ ...prev, [key]: !value }));
    } finally {
      setSaving(false);
    }
  };
  
  const handleSaveAll = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      // TODO: Implement actual database save when settings table exists
      toast.success("Todas as configurações foram salvas com sucesso");
      
      // Apply theme immediately
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    } catch (err) {
      console.error("Erro ao salvar configurações:", err);
      toast.error("Não foi possível salvar suas configurações");
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
              disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
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
        
        <div className="pt-4 flex justify-end">
          <Button 
            onClick={handleSaveAll} 
            disabled={saving || loading}
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : "Salvar Tudo"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSettings;
