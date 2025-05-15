
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppContact } from "../types";

// Simple explicit interface definitions
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
    
    // Use simple arrays and primitive types to avoid complex type inferences
    const uniqueNumbers: string[] = [];
    const seenNumbers = new Set<string>();
    
    // Explicitly check if messageData is an array
    if (Array.isArray(messageData)) {
      for (let i = 0; i < messageData.length; i++) {
        const record = messageData[i] as MessageRecord | null;
        // Use basic type guards with typeof
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
    
    // Use a simple object instead of Record<> type
    const phoneToName: {[key: string]: string} = {};
    
    // Explicitly check if contactData is an array
    if (Array.isArray(contactData)) {
      for (let i = 0; i < contactData.length; i++) {
        const contact = contactData[i] as ContactRecord | null;
        // Use basic type guards with typeof
        if (contact && typeof contact.phone === 'string' && typeof contact.name === 'string') {
          phoneToName[contact.phone] = contact.name;
        }
      }
    }
    
    // Build the final contacts array with explicit types
    const resultContacts: WhatsAppContact[] = [];
    for (let i = 0; i < uniqueNumbers.length; i++) {
      const number = uniqueNumbers[i];
      resultContacts.push({
        id: number,
        number,
        name: phoneToName[number] || number,
        phone: number
      });
    }
    
    return resultContacts;
    
  } catch (error) {
    console.error("Error loading contacts:", error);
    return [];
  }
};
