
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
    
    // Process message data without complex type operations
    const uniqueNumbers: string[] = [];
    const numberSet = new Set<string>();
    
    // Use explicit type assertion and simple iteration
    const messageRecords = messageData as unknown as MessageRecord[];
    if (messageRecords) {
      for (let i = 0; i < messageRecords.length; i++) {
        const record = messageRecords[i];
        if (record && record.number && !numberSet.has(record.number)) {
          numberSet.add(record.number);
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
    
    // Create a map of phone number to contact name with simple loop approach
    const contactMap: Record<string, string> = {};
    
    // Use explicit type assertion and simple iteration
    const contactRecords = contactData as unknown as ContactRecord[];
    if (contactRecords) {
      for (let i = 0; i < contactRecords.length; i++) {
        const contact = contactRecords[i];
        if (contact && contact.phone) {
          contactMap[contact.phone] = contact.name;
        }
      }
    }
    
    // Create contacts list with explicit typing
    const contacts: WhatsAppContact[] = [];
    for (let i = 0; i < uniqueNumbers.length; i++) {
      const number = uniqueNumbers[i];
      contacts.push({
        id: number,
        number,
        name: contactMap[number] || number,
        phone: number
      });
    }
    
    return contacts;
    
  } catch (error) {
    console.error("Error loading contacts:", error);
    return [];
  }
};
