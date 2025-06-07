
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { WhatsAppContact, WhatsAppMessage, WhatsAppConnectionStatus, WhatsAppSession } from "@/types/whatsapp";
import { useWhatsAppSessions } from "@/hooks/useWhatsAppSessions";

interface WhatsAppContextType {
  selectedContact: WhatsAppContact | null;
  setSelectedContact: (contact: WhatsAppContact | null) => void;
  contacts: WhatsAppContact[];
  messages: WhatsAppMessage[];
  loadingMessages: boolean;
  sessionId: string | null;
  connectionStatus: WhatsAppConnectionStatus;
  sendMessage: (to: string, body: string) => Promise<void>;
  disconnect: () => Promise<void>;
  connect: (sessionId: string) => Promise<void>;
  refreshData: () => Promise<void>;
  fetchMessages: (contactId: string, sessionId: string) => Promise<void>;
  
  // Propriedades para WhatsAppIntegration.tsx
  currentSession: string | null;
  setCurrentSession: (sessionId: string | null) => void;
  sessions: WhatsAppSession[];
  loadingSessions: boolean;
  refreshSessions: () => Promise<void>;
  createNewSession: () => string;
}

const WhatsAppContext = createContext<WhatsAppContextType>({} as WhatsAppContextType);

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
  const { 
    currentSession: sessionId, 
    connectionStatus, 
    connectSession,
    disconnectSession,
    refreshSessions,
    sessions,
    loadingSessions,
    createNewSession,
    setCurrentSession
  } = useWhatsAppSessions();
  
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact | null>(null);
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  // URL da API mais confiável
  const API_URL = import.meta.env.VITE_API_URL || "";
  const isConnected = connectionStatus === "connected" && !!sessionId;
  
  const sendMessage = useCallback(async (to: string, body: string) => {
    if (!sessionId || !isConnected) {
      toast.error("Nenhuma sessão WhatsApp conectada");
      return;
    }
    
    try {
      // ID temporário para a mensagem
      const tempId = `temp-${Date.now()}`;
      
      // Adiciona mensagem à UI imediatamente para melhor UX
      const tempMessage: WhatsAppMessage = {
        id: tempId,
        session_id: sessionId,
        number: to,
        message: body,
        from_me: true,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, tempMessage]);
      
      // Envia através da API
      const response = await fetch(`${API_URL}/sessions/${sessionId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number: to, message: body }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao enviar mensagem');
      }
      
      // Aguarda um pouco e busca mensagens atualizadas
      setTimeout(() => {
        if (selectedContact) {
          fetchMessages(selectedContact.phone, sessionId);
        }
      }, 1000);
      
    } catch (error) {
      console.warn('Erro ao enviar mensagem:', error);
      toast.error("Falha ao enviar mensagem");
    }
  }, [sessionId, isConnected, selectedContact, API_URL]);
  
  const fetchMessages = useCallback(async (contactId: string, sessionId: string) => {
    if (!sessionId || !contactId || !API_URL || !isConnected) return;
    
    try {
      setLoadingMessages(true);
      const messagesResponse = await fetch(`${API_URL}/sessions/${sessionId}/messages/${contactId}`);
      
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);
      } else {
        console.warn("Erro ao buscar mensagens:", messagesResponse.status);
      }
    } catch (error) {
      console.warn("Erro ao buscar mensagens:", error);
    } finally {
      setLoadingMessages(false);
    }
  }, [isConnected, API_URL]);
  
  const refreshData = useCallback(async () => {
    if (!sessionId || !API_URL || !isConnected) return;
    
    try {
      // Buscar contatos
      const contactsResponse = await fetch(`${API_URL}/sessions/${sessionId}/contacts`);
      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        setContacts(contactsData);
      }
      
      // Buscar mensagens se um contato estiver selecionado
      if (selectedContact) {
        await fetchMessages(selectedContact.phone, sessionId);
      }
    } catch (error) {
      console.warn("Erro ao atualizar dados do WhatsApp:", error);
    }
  }, [sessionId, selectedContact, fetchMessages, isConnected, API_URL]);

  const connect = useCallback(async (id: string) => {
    if (!API_URL) return;
    
    try {
      await connectSession(id);
    } catch (error) {
      console.warn("Erro ao conectar sessão:", error);
    }
  }, [connectSession, API_URL]);

  const disconnect = useCallback(async () => {
    if (!sessionId || !API_URL) return;
    
    try {
      await disconnectSession(sessionId);
      setSelectedContact(null);
      setMessages([]);
      toast.success("Sessão desconectada com sucesso");
    } catch (error) {
      console.warn("Erro ao desconectar sessão:", error);
    }
  }, [sessionId, disconnectSession, API_URL]);

  // Atualiza dados periodicamente quando conectado
  useEffect(() => {
    if (isConnected) {
      refreshData();
      const interval = setInterval(refreshData, 15000);
      return () => clearInterval(interval);
    }
  }, [isConnected, refreshData]);

  // Limpa contato selecionado quando a sessão muda ou desconecta
  useEffect(() => {
    if (!isConnected) {
      setSelectedContact(null);
      setMessages([]);
    }
  }, [isConnected, sessionId]);

  return (
    <WhatsAppContext.Provider
      value={{
        selectedContact,
        setSelectedContact,
        contacts,
        messages,
        loadingMessages,
        sessionId,
        connectionStatus,
        sendMessage,
        disconnect,
        connect,
        refreshData,
        fetchMessages,
        
        // Propriedades para WhatsAppIntegration.tsx
        currentSession: sessionId,
        setCurrentSession,
        sessions,
        loadingSessions,
        refreshSessions,
        createNewSession
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
