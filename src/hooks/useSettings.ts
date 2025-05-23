
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { settingsService, UserSettings } from "@/services/settings";
import { toast } from "sonner";

export const useSettings = () => {
  const { user, company } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Load settings
  useEffect(() => {
    if (!user) return;
    
    const loadSettings = async () => {
      try {
        setLoading(true);
        const userSettings = await settingsService.getUserSettings(user.id);
        
        if (userSettings) {
          setSettings(userSettings);
          // Apply theme immediately
          settingsService.applyTheme(userSettings.theme);
        } else {
          // Create default settings
          const defaultSettings: UserSettings = {
            user_id: user.id,
            company_id: company?.id,
            theme: "light",
            notifications_enabled: true,
            language: "pt-BR"
          };
          
          const createdSettings = await settingsService.createOrUpdateUserSettings(defaultSettings);
          if (createdSettings) {
            setSettings(createdSettings);
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [user, company]);
  
  // Update a specific setting
  const updateSetting = async <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    if (!settings || !user) return;
    
    try {
      setSaving(true);
      
      // Optimistic update
      setSettings({ ...settings, [key]: value });
      
      // Apply theme immediately if that's the setting being updated
      if (key === 'theme' && typeof value === 'string') {
        settingsService.applyTheme(value);
      }
      
      // Save to database
      const updatedSettings = await settingsService.createOrUpdateUserSettings({
        ...settings,
        [key]: value
      });
      
      if (!updatedSettings) {
        throw new Error("Failed to update setting");
      }
      
      toast.success(`Configuração atualizada com sucesso`);
      
      return true;
    } catch (error) {
      console.error(`Error updating setting ${String(key)}:`, error);
      
      // Revert optimistic update
      if (settings) {
        setSettings({ ...settings });
      }
      
      toast.error("Não foi possível atualizar a configuração");
      return false;
    } finally {
      setSaving(false);
    }
  };
  
  // Save all settings at once
  const saveSettings = async (newSettings: UserSettings) => {
    if (!user) return false;
    
    try {
      setSaving(true);
      
      // Optimistic update
      setSettings(newSettings);
      
      // Apply theme immediately
      if (newSettings.theme) {
        settingsService.applyTheme(newSettings.theme);
      }
      
      // Save to database
      const updatedSettings = await settingsService.createOrUpdateUserSettings(newSettings);
      
      if (!updatedSettings) {
        throw new Error("Failed to save settings");
      }
      
      toast.success("Configurações salvas com sucesso");
      return true;
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Não foi possível salvar as configurações");
      return false;
    } finally {
      setSaving(false);
    }
  };
  
  return {
    settings,
    loading,
    saving,
    updateSetting,
    saveSettings
  };
};
