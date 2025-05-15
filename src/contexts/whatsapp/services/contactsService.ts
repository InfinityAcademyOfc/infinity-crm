
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppContact } from "../types";

// Explicitly define interface types for record structures
interface MessageRecord {
  number: string;
}

interface ContactRecord {
  name: string;
  phone: string;
}

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
    
    // Safely process message data with explicit type assertions
    if (Array.isArray(messageData)) {
      messageData.forEach((item: unknown) => {
        // Type guard check for record structure
        const record = item as MessageRecord;
        if (record && typeof record.number === 'string' && !seenNumbers.has(record.number)) {
          seenNumbers.add(record.number);
          uniqueNumbers.push(record.number);
        }
      });
    }
    
    // Fetch contact names if available
    const { data: contactData, error: contactError } = await supabase
      .from("contacts")
      .select("name, phone")
      .eq("session_id", sessionId);
      
    if (contactError) throw contactError;
    
    // Use a simple object map with explicit string keys/values
    const phoneToName: {[key: string]: string} = {};
    
    // Process contact data with explicit type assertions
    if (Array.isArray(contactData)) {
      contactData.forEach((item: unknown) => {
        // Type guard check for contact structure
        const contact = item as ContactRecord;
        if (contact && typeof contact.phone === 'string' && typeof contact.name === 'string') {
          phoneToName[contact.phone] = contact.name;
        }
      });
    }
    
    // Build the final contacts array with explicit construction
    const contacts: WhatsAppContact[] = uniqueNumbers.map((number: string) => {
      return {
        id: number,
        number,
        name: phoneToName[number] || number,
        phone: number
      };
    });
    
    return contacts;
    
  } catch (error) {
    console.error("Error loading contacts:", error);
    return [];
  }
};
