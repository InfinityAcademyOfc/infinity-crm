import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WhatsAppContact, WhatsAppMessage } from "@/types/whatsapp";

export interface UseWhatsAppMessagesReturn {
  selectedContact: WhatsAppContact | null;
  setSelectedContact: (contact: WhatsAppContact | null) => void;
  contacts: WhatsAppContact[];
  messages: WhatsAppMessage[];
  loadingMessages: boolean;
  sendMessage: (message: string) => Promise<void>;
}

export function useWhatsAppMessages(currentSession: string | null): UseWhatsAppMessagesReturn {
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact | null>(null);
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { toast } = useToast();

  const API_URL = import.meta.env.VITE_API_URL || "";

  const loadContacts = async (sessionId: string) => {
    try {
      const { data: messageData, error: messageError } = await supabase
        .from("whatsapp_messages")
        .select("number")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false });

      if (messageError) throw messageError;

      const uniqueNumbers = Array.from(new Set((messageData || []).map(m => m.number)));

      const { data: contactData, error: contactError } = await supabase
        .from("contacts")
        .select("name, phone")
        .eq("session_id", sessionId);

      if (contactError) throw contactError;

      const contactMap = new Map(contactData?.map(c => [c.phone, c.name]));

      const contactsList = uniqueNumbers.map(number => ({
        id: number,
        number,
        name: contactMap.get(number) || number,
        phone: number
      }));

      setContacts(contactsList);
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar contatos",
        variant: "destructive"
      });
    }
  };

  const loadMessages = async (sessionId: string, contactNumber: string) => {
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from("whatsapp_messages")
        .select("*")
        .eq("session_id", sessionId)
        .eq("number", contactNumber)
        .order("created_at");

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar mensagens",
        variant: "destructive"
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!currentSession || !selectedContact || !message.trim()) return;

    try {
      const response = await fetch(`${API_URL}/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: currentSession,
          number: selectedContact.number || selectedContact.phone,
          message: message.trim()
        })
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar mensagem");
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro",
        description: "Erro ao enviar mensagem",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (!currentSession) return;

    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "whatsapp_messages",
          filter: `session_id=eq.${currentSession}`
        },
        (payload) => {
          const newMsg = payload.new as WhatsAppMessage;
          if (
            selectedContact &&
            (newMsg.number === selectedContact.number || newMsg.number === selectedContact.phone)
          ) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentSession, selectedContact]);

  useEffect(() => {
    if (currentSession && selectedContact) {
      const contactNumber = selectedContact.number || selectedContact.phone || '';
      loadMessages(currentSession, contactNumber);
    }
  }, [selectedContact, currentSession]);

  useEffect(() => {
    if (currentSession) {
      loadContacts(currentSession);
    }
  }, [currentSession]);

  return {
    selectedContact,
    setSelectedContact,
    contacts,
    messages,
    loadingMessages,
    sendMessage
  };
}
