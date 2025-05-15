
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppContact } from "../types";

export const loadContacts = async (sessionId: string): Promise<WhatsAppContact[]> => {
  if (!sessionId) return [];
  
  try {
    // First fetch unique numbers from messages
    const messageResult = await supabase
      .from("whatsapp_messages")
      .select("number")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false });
      
    if (messageResult.error) throw messageResult.error;
    
    // Use primitive arrays to store data
    const uniqueNumbers: string[] = [];
    const seenNumbers = new Set<string>();
    
    // Process message data with simple iteration
    if (messageResult.data && Array.isArray(messageResult.data)) {
      for (let i = 0; i < messageResult.data.length; i++) {
        const item = messageResult.data[i];
        if (item && typeof item.number === 'string' && !seenNumbers.has(item.number)) {
          seenNumbers.add(item.number);
          uniqueNumbers.push(item.number);
        }
      }
    }
    
    // Fetch contact names with simple query
    const contactResult = await supabase
      .from("contacts")
      .select("name, phone")
      .eq("session_id", sessionId);
      
    if (contactResult.error) throw contactResult.error;
    
    // Create a simple map for name lookups
    const phoneToName: Record<string, string> = {};
    
    // Process contact data with simple iteration
    if (contactResult.data) {
      const contactsArray = contactResult.data;
      for (let i = 0; i < contactsArray.length; i++) {
        const contact = contactsArray[i];
        if (contact && 
            typeof contact.phone === 'string' && 
            typeof contact.name === 'string') {
          phoneToName[contact.phone] = contact.name;
        }
      }
    }
    
    // Build contacts array with simple iteration
    const contacts: WhatsAppContact[] = [];
    for (let i = 0; i < uniqueNumbers.length; i++) {
      const number = uniqueNumbers[i];
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
