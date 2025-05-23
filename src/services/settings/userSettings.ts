
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { UserSettings } from "./types";

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
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
}

export async function createOrUpdateUserSettings(settings: UserSettings): Promise<UserSettings | null> {
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
}
