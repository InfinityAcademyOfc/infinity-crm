
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
    // Add explicit type annotation to fix the infinite type instantiation error
    const contactMap = new Map<string, string>();
    
    // Use explicit type annotation for contact parameter
    (contactData || []).forEach((contact: { name: string, phone: string }) => {
      contactMap.set(contact.phone, contact.name);
    });
    
    // Create contacts list with explicit typing
    const contactsList: WhatsAppContact[] = uniqueNumbers.map((number: string) => ({
      id: number,
      number,
      name: contactMap.get(number) || number,
      phone: number
    }));
    
    return contactsList;
  } catch (error) {
    console.error("Error loading messages:", error);
    return [];
  }
};
