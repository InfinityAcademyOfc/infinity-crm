
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
    
    // Convert data to simple array and then extract numbers
    const messageRecords = (messageData || []) as MessageRecord[];
    const numberSet = new Set<string>();
    
    // Add each number to the set to ensure uniqueness
    for (const record of messageRecords) {
      if (record.number) {
        numberSet.add(record.number);
      }
    }
    
    // Convert set to array
    const uniqueNumbers = Array.from(numberSet);
    
    // Fetch contact names if available
    const { data: contactData, error: contactError } = await supabase
      .from("contacts")
      .select("name, phone")
      .eq("session_id", sessionId);
      
    if (contactError) throw contactError;
    
    // Create a map of phone number to contact name
    const contactMap = new Map<string, string>();
    
    // Explicitly type and process contact data
    const contactRecords = (contactData || []) as ContactRecord[];
    for (const contact of contactRecords) {
      contactMap.set(contact.phone, contact.name);
    }
    
    // Create contacts list with explicit typing
    const contacts: WhatsAppContact[] = [];
    for (const number of uniqueNumbers) {
      contacts.push({
        id: number,
        number,
        name: contactMap.get(number) || number,
        phone: number
      });
    }
    
    return contacts;
    
  } catch (error) {
    console.error("Error loading contacts:", error);
    return [];
  }
};
