
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
    
    // Safely process message data with simple iteration
    if (Array.isArray(messageData)) {
      for (let i = 0; i < messageData.length; i++) {
        const item = messageData[i];
        // Simple type check
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
    
    // Use a simple object with explicitly defined keys/values
    const phoneToName: Record<string, string> = {};
    
    // Process contact data with simple iteration
    if (Array.isArray(contactData)) {
      for (let i = 0; i < contactData.length; i++) {
        const item = contactData[i];
        if (item && typeof item.phone === 'string' && typeof item.name === 'string') {
          phoneToName[item.phone] = item.name;
        }
      }
    }
    
    // Build contacts array with simple iteration to avoid complex mapping
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
