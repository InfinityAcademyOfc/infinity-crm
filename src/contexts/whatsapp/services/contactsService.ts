
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
    
    // Use primitive arrays to store data
    const uniqueNumbers: string[] = [];
    const seenNumbers = new Set<string>();
    
    // Process message data with simple iteration
    if (messageData && Array.isArray(messageData)) {
      for (const item of messageData) {
        if (item && typeof item.number === 'string' && !seenNumbers.has(item.number)) {
          seenNumbers.add(item.number);
          uniqueNumbers.push(item.number);
        }
      }
    }
    
    // Fetch contact names if available - use explicit typing
    const { data, error: contactError } = await supabase
      .from("contacts")
      .select("name, phone")
      .eq("session_id", sessionId);
      
    if (contactError) throw contactError;
    
    // Create a simple map for name lookups with explicit typing
    const phoneToName: Record<string, string> = {};
    
    // Process contact data with simple loops and explicit type handling
    const contactData = data as Array<{ name?: string; phone?: string }> | null;
    if (contactData && Array.isArray(contactData)) {
      for (const contact of contactData) {
        if (contact && typeof contact.phone === 'string' && typeof contact.name === 'string') {
          phoneToName[contact.phone] = contact.name;
        }
      }
    }
    
    // Build contacts array with explicit typing
    const contacts: WhatsAppContact[] = [];
    for (const number of uniqueNumbers) {
      contacts.push({
        id: number,
        number: number,
        name: phoneToName[number] || number,
        phone: number
      });
    }
    
    return contacts;
    
  } catch (error) {
    console.error("Error loading contacts:", error);
    return [];
  }
};
