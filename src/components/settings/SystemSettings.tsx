
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Upload, Globe, Download, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { settingsService } from "@/services/settingsService";

const SystemSettings = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("pt-BR");
  const [dateFormat, setDateFormat] = useState("dd/mm/yyyy");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    const loadSettings = async () => {
      try {
        setLoading(true);
        const settings = await settingsService.getUserSettings(user.id);
        
        if (settings) {
          setTheme(settings.theme || "light");
          setLanguage(settings.language || "pt-BR");
          // We could store date format in user_settings as well
          // For now, we'll use a default
        }
      } catch (error) {
        console.error("Error loading system settings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [user]);
  
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    settingsService.applyTheme(newTheme);
  };
  
  const saveSettings = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      const settings = await settingsService.getUserSettings(user.id);
      
      if (settings) {
        await settingsService.createOrUpdateUserSettings({
          ...settings,
          theme,
          language,
        });
        
        toast.success("Configurações do sistema salvas com sucesso");
      }
    } catch (error) {
      console.error("Error saving system settings:", error);
      toast.error("Não foi possível salvar as configurações do sistema");
    } finally {
      setSaving(false);
    }
  };
  
  const handleImportData = () => {
    toast("Importar Dados", {
      description: "Funcionalidade em desenvolvimento"
    });
  };
  
  const handleExportData = () => {
    toast("Exportar Dados", {
      description: "Funcionalidade em desenvolvimento"
    });
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
        <CardTitle>Configurações do Sistema</CardTitle>
        <CardDescription>Ajuste configurações gerais do sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Modo escuro</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ativar/desativar o tema escuro</p>
            </div>
            <Select
              value={theme}
              onValueChange={handleThemeChange}
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
              <p className="font-medium">Idioma do sistema</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Selecione o idioma de exibição</p>
            </div>
            <Select
              value={language}
              onValueChange={setLanguage}
              disabled={saving}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Formato de data</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Escolha o formato de exibição de data</p>
            </div>
            <Select
              value={dateFormat}
              onValueChange={setDateFormat}
              disabled={saving}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dd/mm/yyyy">DD/MM/AAAA</SelectItem>
                <SelectItem value="mm/dd/yyyy">MM/DD/AAAA</SelectItem>
                <SelectItem value="yyyy-mm-dd">AAAA-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-lg font-medium mb-4">Importação e Exportação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleImportData}
            >
              <Upload size={16} />
              Importar Dados
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleExportData}
            >
              <Download size={16} />
              Exportar Dados
            </Button>
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button 
            onClick={saveSettings} 
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : "Salvar Configurações"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;
