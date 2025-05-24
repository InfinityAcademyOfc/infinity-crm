
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { WhatsAppContact, WhatsAppMessage, WhatsAppConnectionStatus, WhatsAppSession, WhatsAppContextType } from "@/types/whatsapp";
import { supabase } from "@/lib/supabase";

const WhatsAppContext = createContext<WhatsAppContextType>({} as WhatsAppContextType);

const API_URL = import.meta.env.VITE_API_URL || "";

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [currentSession, setCurrentSession] = useState<string | null>(
    () => localStorage.getItem("wa-session-id") || null
  );
  const [connectionStatus, setConnectionStatus] = useState<WhatsAppConnectionStatus>("not_started");
  const [isApiAvailable, setIsApiAvailable] = useState<boolean>(false);
  
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact | null>(null);
  const [contacts, setContacts] = useState<WhatsAppContact[]>([
    { id: "1", name: "João Silva", phone: "+5511999998888" },
    { id: "2", name: "Maria Oliveira", phone: "+5511987654321" },
    { id: "3", name: "Suporte Infinity CRM", phone: "+5511912345678" }
  ]);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const refreshSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      // Mock sessions para desenvolvimento
      const mockSessions: WhatsAppSession[] = [
        { id: "session_1", name: "WhatsApp Principal", status: "connected" },
        { id: "session_2", name: "WhatsApp Suporte", status: "disconnected" }
      ];
      setSessions(mockSessions);
      setIsApiAvailable(true);
    } catch (error) {
      console.warn("Erro ao carregar sessões:", error);
      setIsApiAvailable(false);
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  const connectSession = useCallback(async (sessionId: string) => {
    try {
      setConnectionStatus("loading");
      setCurrentSession(sessionId);
      localStorage.setItem("wa-session-id", sessionId);
      
      // Simular conexão
      setTimeout(() => {
        setConnectionStatus("connected");
        toast.success("WhatsApp conectado com sucesso!");
      }, 2000);
    } catch (error) {
      console.warn("Erro ao conectar sessão:", error);
      setConnectionStatus("error");
    }
  }, []);

  const disconnectSession = useCallback(async (sessionId: string) => {
    try {
      setConnectionStatus("not_started");
      setSelectedContact(null);
      setMessages([]);
      toast.success("Sessão desconectada");
    } catch (error) {
      console.warn("Erro ao desconectar sessão:", error);
    }
  }, []);

  const createNewSession = useCallback(() => {
    const newSessionId = `session_${Date.now()}`;
    setCurrentSession(newSessionId);
    localStorage.setItem("wa-session-id", newSessionId);
    setConnectionStatus("not_started");
    refreshSessions();
    return newSessionId;
  }, [refreshSessions]);

  const sendMessage = useCallback(async (to: string, body: string) => {
    if (!currentSession || connectionStatus !== "connected") {
      toast.error("WhatsApp não conectado");
      return;
    }
    
    try {
      const tempMessage: WhatsAppMessage = {
        id: `temp-${Date.now()}`,
        session_id: currentSession,
        number: to,
        message: body,
        from_me: true,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, tempMessage]);
      toast.success("Mensagem enviada");
    } catch (error) {
      console.warn('Erro ao enviar mensagem:', error);
      toast.error("Erro ao enviar mensagem");
    }
  }, [currentSession, connectionStatus]);
  
  const fetchMessages = useCallback(async (contactId: string, sessionId: string) => {
    if (!sessionId || !contactId) return;
    
    try {
      setLoadingMessages(true);
      
      // Mock messages
      const mockMessages = [
        {
          id: `msg-${Date.now()}-1`,
          session_id: sessionId,
          number: contactId,
          message: "👋 Olá! Como posso ajudar?",
          from_me: false,
          created_at: new Date().toISOString()
        }
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.warn("Erro ao buscar mensagens:", error);
    } finally {
      setLoadingMessages(false);
    }
  }, []);
  
  const refreshData = useCallback(async () => {
    if (!currentSession) return;
    
    try {
      // Refresh contacts and messages
      if (selectedContact) {
        await fetchMessages(selectedContact.phone, currentSession);
      }
    } catch (error) {
      console.warn("Erro ao atualizar dados:", error);
    }
  }, [currentSession, selectedContact, fetchMessages]);

  const connect = useCallback(async (id: string) => {
    await connectSession(id);
  }, [connectSession]);

  const disconnect = useCallback(async () => {
    if (!currentSession) return;
    await disconnectSession(currentSession);
  }, [currentSession, disconnectSession]);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  return (
    <WhatsAppContext.Provider
      value={{
        selectedContact,
        setSelectedContact,
        contacts,
        messages,
        loadingMessages,
        sessionId: currentSession,
        connectionStatus,
        sendMessage,
        disconnect,
        connect,
        refreshData,
        fetchMessages,
        currentSession,
        setCurrentSession,
        sessions,
        loadingSessions,
        refreshSessions,
        createNewSession,
        isApiAvailable
      }}
    >
      {children}
    </WhatsAppContext.Provider>
  );
}

export const useWhatsApp = () => {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error("useWhatsApp deve ser usado dentro de um WhatsAppProvider");
  }
  return context;
};
