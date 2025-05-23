
import React, { createContext, useState, useContext, useEffect } from "react";
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
  
  // Adding the missing properties for WhatsAppIntegration.tsx
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
    createNewSession
  } = useWhatsAppSessions();
  
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact | null>(null);
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const sendMessage = async (to: string, body: string) => {
    if (!sessionId) {
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
      const API_URL = import.meta.env.VITE_API_URL || "";
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
      
      // Fetch updated messages (or add real message ID if returned by API)
      // This is simplified - you might want to update the temp message with real ID
      refreshData();
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Falha ao enviar mensagem");
    }
  };
  
  const fetchMessages = async (contactId: string, sessionId: string) => {
    if (!sessionId || !contactId) return;
    
    try {
      setLoadingMessages(true);
      const API_URL = import.meta.env.VITE_API_URL || "";
      const messagesResponse = await fetch(`${API_URL}/sessions/${sessionId}/messages/${contactId}`);
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Don't show error toast for better UX when network issues occur
    } finally {
      setLoadingMessages(false);
    }
  };
  
  const refreshData = async () => {
    if (!sessionId) return;
    
    try {
      // Simplified API calls - in a real app, you'd implement proper API service
      const API_URL = import.meta.env.VITE_API_URL || "";
      
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
  };

  const connect = async (id: string) => {
    try {
      await connectSession(id);
      toast.success("Sessão conectada com sucesso");
    } catch (error) {
      toast.error("Erro ao conectar sessão");
    }
  };

  const disconnect = async () => {
    if (!sessionId) return;
    try {
      await disconnectSession(sessionId);
      setSelectedContact(null);
      setMessages([]);
      toast.success("Sessão desconectada com sucesso");
    } catch (error) {
      toast.error("Erro ao desconectar sessão");
    }
  };

  // Map sessionId to currentSession for compatibility
  const currentSession = sessionId;
  const setCurrentSession = (sid: string | null) => {
    // Any additional logic can be added here if needed
    localStorage.setItem("wa-session-id", sid || "");
  };

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
        
        // Added properties for WhatsAppIntegration.tsx
        currentSession,
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
