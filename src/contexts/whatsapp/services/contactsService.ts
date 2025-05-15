
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
    
    // Process message data with primitive types only
    const uniqueNumbers: string[] = [];
    const numberSet = new Set<string>();
    
    // Type safety: explicitly convert to array first then process
    const messages = Array.isArray(messageData) ? messageData : [];
    
    for (let i = 0; i < messages.length; i++) {
      const record = messages[i];
      if (record && typeof record.number === 'string' && !numberSet.has(record.number)) {
        numberSet.add(record.number);
        uniqueNumbers.push(record.number);
      }
    }
    
    // Fetch contact names if available
    const { data: contactData, error: contactError } = await supabase
      .from("contacts")
      .select("name, phone")
      .eq("session_id", sessionId);
      
    if (contactError) throw contactError;
    
    // Create a simple object map for phone numbers to names
    const contactMap: Record<string, string> = {};
    
    // Type safety: explicitly convert to array first then process
    const contacts = Array.isArray(contactData) ? contactData : [];
    
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      if (contact && typeof contact.phone === 'string' && typeof contact.name === 'string') {
        contactMap[contact.phone] = contact.name;
      }
    }
    
    // Create contacts list using primitive operations
    const result: WhatsAppContact[] = [];
    for (let i = 0; i < uniqueNumbers.length; i++) {
      const number = uniqueNumbers[i];
      result.push({
        id: number,
        number,
        name: contactMap[number] || number,
        phone: number
      });
    }
    
    return result;
    
  } catch (error) {
    console.error("Error loading contacts:", error);
    return [];
  }
};
