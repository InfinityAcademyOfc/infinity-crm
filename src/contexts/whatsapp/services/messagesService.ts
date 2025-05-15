
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppMessage } from "../types";

export const loadMessages = async (
  sessionId: string,
  contactNumber: string
): Promise<WhatsAppMessage[]> => {
  if (!sessionId || !contactNumber) return [];
  
  try {
    const { data, error } = await supabase
      .from("whatsapp_messages")
      .select("*")
      .eq("session_id", sessionId)
      .eq("number", contactNumber)
      .order("created_at");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error loading messages:", error);
    return [];
  }
};
