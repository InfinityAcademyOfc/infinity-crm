
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
    
    // Process message data with simple iteration and explicit type checking
    if (Array.isArray(messageData)) {
      for (let i = 0; i < messageData.length; i++) {
        const item = messageData[i];
        if (item && typeof item.number === 'string' && !seenNumbers.has(item.number)) {
          seenNumbers.add(item.number);
          uniqueNumbers.push(item.number);
        }
      }
    }
    
    // Fetch contact names if available
    const { data: contactData, error: contactError } = await supabase
      .from("contacts")
      .select("name, phone")
      .eq("session_id", sessionId);
      
    if (contactError) throw contactError;
    
    // Create a simple dictionary with string keys and values
    const phoneToName: Record<string, string> = {};
    
    // Process contact data with simple loops instead of higher-order functions
    if (Array.isArray(contactData)) {
      for (let i = 0; i < contactData.length; i++) {
        const contact = contactData[i];
        if (contact && typeof contact.phone === 'string' && typeof contact.name === 'string') {
          phoneToName[contact.phone] = contact.name;
        }
      }
    }
    
    // Build contacts array with explicit construction and simple iteration
    const contacts: WhatsAppContact[] = [];
    for (let i = 0; i < uniqueNumbers.length; i++) {
      const number = uniqueNumbers[i];
      contacts.push({
        id: number,
        number,
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
