
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface UserSettings {
  id?: string;
  user_id: string;
  company_id?: string | null;
  theme: string;
  notifications_enabled: boolean;
  language: string;
  updated_at?: string;
  created_at?: string;
  dashboard_config?: DashboardConfig | null;
}

export interface NotificationSettings {
  new_leads: boolean;
  client_activities: boolean;
  payments: boolean;
  meeting_reminders: boolean;
  email_alerts: boolean;
}

export interface SecuritySettings {
  two_factor_enabled: boolean;
  last_password_change?: string | null;
}

// Define AutomationRule interface without re-exporting
export interface AutomationRule {
  id: string;
  condition: {
    field: string;
    operator: string;
    value: string;
  };
  action: {
    type: string;
    value: string;
  };
}

export interface DashboardConfig {
  charts: Array<{
    id: string;
    title: string;
    enabled: boolean;
    type: string;
    order: number;
  }>;
}

export const settingsService = {
  // User preferences
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .single();
        
      if (error) {
        if (error.code === "PGRST116") { // No rows found
          return null;
        }
        console.error("Error fetching user settings:", error);
        throw error;
      }
      
      return data as UserSettings;
    } catch (error) {
      console.error("Failed to fetch user settings:", error);
      return null;
    }
  },
  
  async createOrUpdateUserSettings(settings: UserSettings): Promise<UserSettings | null> {
    try {
      // Check if settings exist
      const { data: existing } = await supabase
        .from("user_settings")
        .select("id")
        .eq("user_id", settings.user_id)
        .single();
      
      let result;
      
      if (existing) {
        // Update
        const { data, error } = await supabase
          .from("user_settings")
          .update({
            theme: settings.theme,
            notifications_enabled: settings.notifications_enabled,
            language: settings.language,
            dashboard_config: settings.dashboard_config,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", settings.user_id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        // Create
        const { data, error } = await supabase
          .from("user_settings")
          .insert({
            user_id: settings.user_id,
            company_id: settings.company_id,
            theme: settings.theme,
            notifications_enabled: settings.notifications_enabled,
            language: settings.language,
            dashboard_config: settings.dashboard_config,
          })
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      
      return result as UserSettings;
    } catch (error) {
      console.error("Failed to update user settings:", error);
      toast.error("Não foi possível salvar as configurações");
      return null;
    }
  },
  
  // Dashboard settings
  async saveDashboardConfig(userId: string, config: DashboardConfig): Promise<boolean> {
    try {
      // Store in a new table or as a JSON field in user_settings
      const { error } = await supabase
        .from("user_settings")
        .update({
          dashboard_config: config
        })
        .eq("user_id", userId);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Failed to save dashboard config:", error);
      toast.error("Não foi possível salvar as configurações do dashboard");
      return false;
    }
  },
  
  // Automation rules
  async saveAutomationRules(userId: string, companyId: string, rules: AutomationRule[]): Promise<boolean> {
    try {
      // Check if we have a record for this user/company
      const { data: existing } = await supabase
        .from("automation_rules")
        .select("id")
        .eq("user_id", userId)
        .eq("company_id", companyId)
        .single();
      
      if (existing) {
        const { error } = await supabase
          .from("automation_rules")
          .update({
            rules: rules,
            updated_at: new Date().toISOString()
          })
          .eq("id", existing.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("automation_rules")
          .insert({
            user_id: userId,
            company_id: companyId,
            rules: rules
          });
          
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Failed to save automation rules:", error);
      toast.error("Não foi possível salvar as regras de automação");
      return false;
    }
  },
  
  // Apply theme
  applyTheme(theme: string): void {
    document.documentElement.classList.remove('light', 'dark');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(systemPrefersDark ? 'dark' : 'light');
    }
  },

  // Update user password
  async updatePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success("Senha atualizada com sucesso!");
      return true;
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Erro ao atualizar senha");
      return false;
    }
  }
};

// Export the type only, not re-export the interface
export type { AutomationRule };
