
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useWhatsAppSession } from "@/contexts/WhatsAppSessionContext";
import { WhatsAppContact, WhatsAppMessage } from "@/types/whatsapp";

export interface WhatsAppMessagesHookResult {
  messages: WhatsAppMessage[];
  contacts: WhatsAppContact[];
  isLoading: boolean;
  error: string | null;
  selectedContact: WhatsAppContact | null;
  setSelectedContact: (contact: WhatsAppContact | null) => void;
  sendMessage: (to: string, body: string) => Promise<void>;
}

export function useWhatsAppMessages(): WhatsAppMessagesHookResult {
  const { sessionId } = useWhatsAppSession();
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Fetch messages
        const { data: msgData, error: msgError } = await supabase
          .from("whatsapp_messages")
          .select("*")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: true });

        // Fetch contacts
        const { data: contactsData, error: contactsError } = await supabase
          .from("contacts")
          .select("*")
          .eq("session_id", sessionId);

        if (msgError || contactsError) {
          console.error("Error fetching data:", msgError || contactsError);
          if (sessionId) {
            toast.error("Erro ao carregar mensagens ou contatos");
          }
          setError("Erro ao carregar dados");
          setIsLoading(false);
          return;
        }

        // Transform data to match our WhatsAppMessage type
        const formattedMessages: WhatsAppMessage[] = msgData ? msgData.map((msg: any) => ({
          id: msg.id,
          session_id: msg.session_id,
          number: msg.number,
          message: msg.message,
          from_me: msg.from_me,
          created_at: msg.created_at
        })) : [];

        // Transform data to match our WhatsAppContact type
        const formattedContacts: WhatsAppContact[] = contactsData ? contactsData.map((contact: any) => ({
          id: contact.id,
          name: contact.name,
          phone: contact.phone,
          number: contact.phone, // For compatibility
        })) : [];

        setMessages(formattedMessages);
        setContacts(formattedContacts);
        setError(null);
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError("Erro ao processar dados");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  const sendMessage = async (to: string, body: string) => {
    if (!sessionId) return;

    try {
      const { error } = await supabase.from("whatsapp_messages").insert([
        {
          number: to,
          message: body,
          session_id: sessionId,
          from_me: true,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error sending message:", error);
        toast.error("Erro ao enviar mensagem");
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            session_id: sessionId,
            number: to,
            message: body,
            from_me: true,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error("Error in sendMessage:", err);
      toast.error("Erro ao enviar mensagem");
    }
  };

  return { 
    messages, 
    contacts, 
    isLoading, 
    error, 
    selectedContact, 
    setSelectedContact, 
    sendMessage 
  };
}
