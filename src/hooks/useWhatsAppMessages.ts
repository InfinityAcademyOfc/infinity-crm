import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useWhatsAppSession } from "@/contexts/WhatsAppSessionContext";

export interface Message {
  id: string;
  from: string;
  to: string;
  body: string;
  timestamp: string;
  session_id: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  session_id: string;
}

export interface WhatsAppMessagesHookResult {
  messages: Message[];
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (to: string, body: string) => Promise<void>;
}

export function useWhatsAppMessages(): WhatsAppMessagesHookResult {
  const { sessionId } = useWhatsAppSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);

      const { data: msgData, error: msgError } = await supabase
        .from("messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("timestamp", { ascending: true });

      const { data: contactsData, error: contactsError } = await supabase
        .from("contacts")
        .select("*")
        .eq("session_id", sessionId);

      if (msgError || contactsError) {
        if (sessionId) {
          toast.error("Erro ao carregar mensagens ou contatos");
        }
        setError("Erro ao carregar dados");
        setIsLoading(false);
        return;
      }

      setMessages(msgData || []);
      setContacts(contactsData || []);
      setError(null);
      setIsLoading(false);
    };

    fetchData();
  }, [sessionId]);

  const sendMessage = async (to: string, body: string) => {
    if (!sessionId) return;

    const { error } = await supabase.from("messages").insert([
      {
        to,
        body,
        session_id: sessionId,
        from: "me",
        timestamp: new Date().toISOString(),
      },
    ]);

    if (error) {
      toast.error("Erro ao enviar mensagem");
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          from: "me",
          to,
          body,
          timestamp: new Date().toISOString(),
          session_id: sessionId,
        },
      ]);
    }
  };

  return { messages, contacts, isLoading, error, sendMessage };
}
