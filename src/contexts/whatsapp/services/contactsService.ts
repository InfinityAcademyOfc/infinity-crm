
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppContact } from "../types";

export const loadContacts = async (sessionId: string): Promise<WhatsAppContact[]> => {
  if (!sessionId) return [];
  
  try {
    // First fetch unique numbers from messages
    const { data: messageData, error: messageError } = await supabase
      .from("whatsapp_messages")
      .select("number")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false });
      
    if (messageError) throw messageError;
    
    // Extract unique numbers
    const uniqueNumbers = Array.from(new Set((messageData || []).map(m => m.number)));
    
    // Fetch contact names if available
    const { data: contactData, error: contactError } = await supabase
      .from("contacts")
      .select("name, phone")
      .eq("session_id", sessionId);
      
    if (contactError) throw contactError;
    
    // Create a map of phone number to contact name
    const contactMap = new Map();
    (contactData || []).forEach(contact => {
      contactMap.set(contact.phone, contact.name);
    });
    
    // Create contacts list
    return uniqueNumbers.map(number => ({
      id: number,
      number,
      name: contactMap.get(number) || number,
      phone: number
    }));
  } catch (error) {
    console.error("Error loading contacts:", error);
    return [];
  }
};
