
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Types for WhatsApp settings
export interface WhatsAppConfig {
  id?: string;
  session_id: string;
  welcome_message: string | null;
  first_msg_daily: boolean;
  delay_seconds: number;
  keyword_trigger?: any;
  user_id?: string;
}

export interface WhatsAppSession {
  id: string;
  session_id: string;
  name?: string;
  phone?: string;
  profile_id?: string;
  status: string;
  is_connected: boolean;
  qr_code?: string;
}

// Service to manage WhatsApp settings
export const whatsAppService = {
  // Get WhatsApp config for a session
  async getConfig(sessionId: string): Promise<WhatsAppConfig | null> {
    try {
      const { data, error } = await supabase
        .from("config")
        .select("*")
        .eq("session_id", sessionId)
        .single();
        
      if (error) {
        if (error.code !== "PGRST116") { // No rows found
          console.error("Error fetching WhatsApp config:", error);
        }
        return null;
      }
      
      return data as WhatsAppConfig;
    } catch (error) {
      console.error("Failed to get WhatsApp config:", error);
      return null;
    }
  },
  
  // Create or update WhatsApp config
  async saveConfig(config: WhatsAppConfig): Promise<boolean> {
    try {
      // Check if config exists
      const { data, error: checkError } = await supabase
        .from("config")
        .select("id")
        .eq("session_id", config.session_id)
        .single();
        
      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }
      
      if (data) {
        // Update
        const { error } = await supabase
          .from("config")
          .update({
            welcome_message: config.welcome_message,
            first_msg_daily: config.first_msg_daily,
            delay_seconds: config.delay_seconds,
            keyword_trigger: config.keyword_trigger || null
          })
          .eq("id", data.id);
          
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from("config")
          .insert({
            session_id: config.session_id,
            welcome_message: config.welcome_message,
            first_msg_daily: config.first_msg_daily,
            delay_seconds: config.delay_seconds,
            user_id: config.user_id
          });
          
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Failed to save WhatsApp config:", error);
      return false;
    }
  },
  
  // Get active sessions for a user
  async getActiveSessions(userId: string): Promise<WhatsAppSession[]> {
    try {
      const { data, error } = await supabase
        .from("whatsapp_sessions")
        .select("*")
        .eq("profile_id", userId)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      return data as WhatsAppSession[];
    } catch (error) {
      console.error("Failed to get WhatsApp sessions:", error);
      return [];
    }
  }
};
