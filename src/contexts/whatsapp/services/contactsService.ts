
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppContact } from "../types";

// Define explicit interfaces for our data structures
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
    
    // Process message data with primitive operations
    const uniqueNumbers: string[] = [];
    const seenNumbers = new Set<string>();
    
    // Safely handle message data as a simple array
    if (Array.isArray(messageData)) {
      for (let i = 0; i < messageData.length; i++) {
        const record = messageData[i];
        if (record && typeof record.number === 'string' && !seenNumbers.has(record.number)) {
          seenNumbers.add(record.number);
          uniqueNumbers.push(record.number);
        }
      }
    }
    
    // Fetch contact names if available
    const { data: contactData, error: contactError } = await supabase
      .from("contacts")
      .select("name, phone")
      .eq("session_id", sessionId);
      
    if (contactError) throw contactError;
    
    // Create a simple lookup object with explicit typing
    const nameByPhone: {[key: string]: string} = {};
    
    // Safely handle contact data as a simple array
    if (Array.isArray(contactData)) {
      for (let i = 0; i < contactData.length; i++) {
        const contact = contactData[i];
        if (contact && typeof contact.phone === 'string' && typeof contact.name === 'string') {
          nameByPhone[contact.phone] = contact.name;
        }
      }
    }
    
    // Create the final contacts list with explicit types
    const finalContacts: WhatsAppContact[] = [];
    for (let i = 0; i < uniqueNumbers.length; i++) {
      const number = uniqueNumbers[i];
      finalContacts.push({
        id: number,
        number,
        name: nameByPhone[number] || number,
        phone: number
      });
    }
    
    return finalContacts;
    
  } catch (error) {
    console.error("Error loading contacts:", error);
    return [];
  }
};
