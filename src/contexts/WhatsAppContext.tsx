
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
  
  // Adding properties for WhatsAppIntegration.tsx
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
  
  // More reliable API URL handling
  const API_URL = import.meta.env.VITE_API_URL || "";
  const isConnected = connectionStatus === "connected" && !!sessionId;
  
  const sendMessage = useCallback(async (to: string, body: string) => {
    if (!sessionId || !isConnected) {
      toast.error("Nenhuma sessão WhatsApp conectada");
      return;
    }
    
    try {
      // Create a temporary message ID
      const tempId = `temp-${Date.now()}`;
      
      // Add message to UI immediately for better UX
      const tempMessage: WhatsAppMessage = {
        id: tempId,
        session_id: sessionId,
        number: to,
        message: body,
        from_me: true,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, tempMessage]);
      
      // Send through API
      const response = await fetch(`${API_URL}/sessions/${sessionId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number: to, message: body }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      // Wait a bit and then fetch updated messages to get the actual message ID
      setTimeout(() => {
        if (selectedContact) {
          fetchMessages(selectedContact.phone, sessionId);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
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
        console.log("Erro ao buscar mensagens:", messagesResponse.status);
        // Don't clear messages on error to preserve user experience
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Don't show error toast for better UX when network issues occur
    } finally {
      setLoadingMessages(false);
    }
  }, [isConnected, API_URL]);
  
  const refreshData = useCallback(async () => {
    if (!sessionId || !API_URL || !isConnected) return;
    
    try {
      // Fetch contacts
      const contactsResponse = await fetch(`${API_URL}/sessions/${sessionId}/contacts`);
      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        setContacts(contactsData);
      }
      
      // Fetch messages if a contact is selected
      if (selectedContact) {
        await fetchMessages(selectedContact.phone, sessionId);
      }
    } catch (error) {
      console.error("Error refreshing WhatsApp data:", error);
      // Don't show toast here to avoid spamming with errors
    }
  }, [sessionId, selectedContact, fetchMessages, isConnected, API_URL]);

  const connect = useCallback(async (id: string) => {
    if (!API_URL) {
      toast.error("API do WhatsApp não configurada");
      return;
    }
    
    try {
      await connectSession(id);
      // Don't show success toast here - QRCodeScanner will show it after successful scan
    } catch (error) {
      toast.error("Erro ao conectar sessão");
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
      toast.error("Erro ao desconectar sessão");
    }
  }, [sessionId, disconnectSession, API_URL]);

  // Periodically refresh data when connected
  useEffect(() => {
    if (isConnected) {
      refreshData();
      const interval = setInterval(refreshData, 15000);
      return () => clearInterval(interval);
    }
  }, [isConnected, refreshData]);

  // Clear selected contact when session changes or disconnects
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
        
        // Properties for WhatsAppIntegration.tsx
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
