import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Tipos
export type WhatsAppConnectionStatus = 'connected' | 'disconnected' | 'qr' | 'error' | 'not_started';

export type WhatsAppSession = {
  id: string;
  name?: string;
  status: string; // 'CONNECTED' | 'DISCONNECTED' etc.
};

export type WhatsAppContact = {
  id: string;
  name?: string;
  phone?: string;
  number?: string;
};

export type WhatsAppMessage = {
  id: string;
  session_id: string;
  number: string;
  message: string;
  from_me: boolean;
  created_at: string;
};

interface WhatsAppContextType {
  currentSession: string | null;
  setCurrentSession: (sessionId: string | null) => void;
  sessions: WhatsAppSession[];
  loadingSessions: boolean;
  connectionStatus: WhatsAppConnectionStatus;
  selectedContact: WhatsAppContact | null;
  setSelectedContact: (contact: WhatsAppContact | null) => void;
  contacts: WhatsAppContact[];
  messages: WhatsAppMessage[];
  loadingMessages: boolean;
  refreshSessions: () => Promise<void>;
  connectSession: (sessionId: string) => Promise<void>;
  disconnectSession: (sessionId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  createNewSession: () => string;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "";

export const WhatsAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<string | null>(() => localStorage.getItem("wa-session-id") || null);
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<WhatsAppConnectionStatus>("not_started");
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact | null>(null);
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { toast } = useToast();

  const refreshSessions = async () => {
    setLoadingSessions(true);
    try {
      const res = await fetch(`${API_URL}/sessions`);
      if (!res.ok) throw new Error(`Failed to fetch sessions: ${res.status}`);
      const data = await res.json();
      setSessions(data);
    } catch (error) {
      console.error("refreshSessions error:", error);
      // Removemos notificações de erro sobre sessões
    } finally {
      setLoadingSessions(false);
    }
  };

  const fetchConnectionStatus = async (sessionId: string) => {
    try {
      const res = await fetch(`${API_URL}/sessions/${sessionId}/status`);
      if (!res.ok) throw new Error(`Status fetch error: ${res.status}`);
      const data = await res.json();
      setConnectionStatus(data.status || "error");
    } catch (error) {
      console.error("fetchConnectionStatus error:", error);
      setConnectionStatus("error");
    }
  };

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
      console.error("loadContacts error:", error);
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
      console.error("loadMessages error:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar mensagens",
        variant: "destructive",
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  const connectSession = async (sessionId: string) => {
    try {
      await fetch(`${API_URL}/sessions/${sessionId}/start`, { method: "POST" });
      setCurrentSession(sessionId);
      localStorage.setItem("wa-session-id", sessionId);
      await fetchConnectionStatus(sessionId);
    } catch (error) {
      console.error("connectSession error:", error);
      toast({
        title: "Erro",
        description: "Não foi possível conectar à sessão do WhatsApp",
        variant: "destructive",
      });
    }
  };

  const disconnectSession = async (sessionId: string) => {
    try {
      await fetch(`${API_URL}/sessions/${sessionId}/logout`, { method: "POST" });
      setConnectionStatus("not_started");
      // Removemos notificações sobre sessão
      await refreshSessions();
    } catch (error) {
      console.error("disconnectSession error:", error);
      // Removemos notificações de erro sobre sessões
    }
  };

  const sendMessage = async (message: string) => {
    if (!currentSession || !selectedContact || !message.trim()) return;
    try {
      await fetch(`${API_URL}/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: currentSession,
          number: selectedContact.number || selectedContact.phone,
          message: message.trim(),
        })
      });
    } catch (error) {
      console.error("sendMessage error:", error);
      // Removemos notificações de erro sobre sessões
    }
  };

  const createNewSession = () => {
    const newSessionId = `session_${Date.now()}`;
    setCurrentSession(newSessionId);
    localStorage.setItem("wa-session-id", newSessionId);
    setConnectionStatus("not_started");
    return newSessionId;
  };

  // Subscrição de mensagens em tempo real
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
          filter: `session_id=eq.${currentSession}`,
        },
        (payload) => {
          const newMsg = payload.new as WhatsAppMessage;
          if (selectedContact && (newMsg.number === selectedContact.number || newMsg.number === selectedContact.phone)) {
            setMessages(prev => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [currentSession, selectedContact]);

  // Atualizar status de conexão periodicamente
  useEffect(() => {
    if (!currentSession) return;
    fetchConnectionStatus(currentSession);
    const interval = setInterval(() => fetchConnectionStatus(currentSession), 10000);
    return () => clearInterval(interval);
  }, [currentSession]);

  // Carregar mensagens quando o contato mudar
  useEffect(() => {
    if (currentSession && selectedContact) {
      loadMessages(currentSession, selectedContact.number || selectedContact.phone || '');
    }
  }, [selectedContact]);

  // Carregar contatos ao mudar sessão
  useEffect(() => {
    if (currentSession) loadContacts(currentSession);
  }, [currentSession]);

  // Carregar sessões inicialmente
  useEffect(() => {
    refreshSessions();
    const interval = setInterval(refreshSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <WhatsAppContext.Provider
      value={{
        currentSession,
        setCurrentSession,
        sessions,
        loadingSessions,
        connectionStatus,
        selectedContact,
        setSelectedContact,
        contacts,
        messages,
        loadingMessages,
        refreshSessions,
        connectSession,
        disconnectSession,
        sendMessage,
        createNewSession,
      }}
    >
      {children}
    </WhatsAppContext.Provider>
  );
};

export const useWhatsApp = () => {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error("useWhatsApp deve ser usado dentro de um WhatsAppProvider");
  }
  return context;
};
