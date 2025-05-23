
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { DashboardConfig } from "./types";

export async function saveDashboardConfig(userId: string, config: DashboardConfig): Promise<boolean> {
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
}
