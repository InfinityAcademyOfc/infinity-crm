
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { WhatsAppContact, WhatsAppMessage, WhatsAppConnectionStatus, WhatsAppSession, WhatsAppContextType } from "@/types/whatsapp";

const WhatsAppContext = createContext<WhatsAppContextType>({} as WhatsAppContextType);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [currentSession, setCurrentSession] = useState<string | null>(
    () => localStorage.getItem("wa-session-id") || null
  );
  const [connectionStatus, setConnectionStatus] = useState<WhatsAppConnectionStatus>("not_started");
  const [isApiAvailable, setIsApiAvailable] = useState<boolean>(false);
  
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact | null>(null);
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Verificar se a API está disponível
  const checkApiAvailability = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/status`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setIsApiAvailable(true);
        console.log("WhatsApp API disponível");
        return true;
      } else {
        throw new Error("API não responde");
      }
    } catch (error) {
      console.warn("WhatsApp API não disponível, usando modo simulado:", error);
      setIsApiAvailable(false);
      return false;
    }
  }, []);

  const refreshSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      const apiAvailable = await checkApiAvailability();
      
      if (apiAvailable) {
        const response = await fetch(`${API_URL}/sessions`);
        if (response.ok) {
          const data = await response.json();
          setSessions(data);
        } else {
          throw new Error("Erro ao buscar sessões");
        }
      } else {
        // Mock sessions para desenvolvimento
        const mockSessions: WhatsAppSession[] = [
          { id: "session_1", name: "WhatsApp Principal", status: "connected" },
          { id: "session_2", name: "WhatsApp Suporte", status: "disconnected" }
        ];
        setSessions(mockSessions);
      }
    } catch (error) {
      console.warn("Erro ao carregar sessões:", error);
      // Fallback para sessions mock
      const mockSessions: WhatsAppSession[] = [
        { id: "session_1", name: "WhatsApp Principal", status: "disconnected" }
      ];
      setSessions(mockSessions);
    } finally {
      setLoadingSessions(false);
    }
  }, [checkApiAvailability]);

  const connectSession = useCallback(async (sessionId: string) => {
    try {
      setConnectionStatus("loading");
      setCurrentSession(sessionId);
      localStorage.setItem("wa-session-id", sessionId);
      
      if (isApiAvailable) {
        const response = await fetch(`${API_URL}/sessions/${sessionId}/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          setConnectionStatus("qr");
          toast.success("Sessão iniciada! Escaneie o QR Code.");
        } else {
          throw new Error("Erro ao iniciar sessão");
        }
      } else {
        // Simular conexão
        setTimeout(() => {
          setConnectionStatus("connected");
          toast.success("WhatsApp conectado com sucesso!");
          
          // Carregar contatos mock
          const mockContacts: WhatsAppContact[] = [
            { id: "1", name: "João Silva", phone: "+5511999998888" },
            { id: "2", name: "Maria Oliveira", phone: "+5511987654321" },
            { id: "3", name: "Suporte Infinity CRM", phone: "+5511912345678" },
            { id: "4", name: "Cliente ABC Ltda", phone: "+5511888777666" },
            { id: "5", name: "Fornecedor XYZ", phone: "+5511777666555" }
          ];
          setContacts(mockContacts);
        }, 2000);
      }
    } catch (error) {
      console.warn("Erro ao conectar sessão:", error);
      setConnectionStatus("error");
      toast.error("Erro ao conectar WhatsApp");
    }
  }, [isApiAvailable]);

  const disconnectSession = useCallback(async (sessionId: string) => {
    try {
      if (isApiAvailable) {
        await fetch(`${API_URL}/sessions/${sessionId}/logout`, {
          method: 'POST'
        });
      }
      
      setConnectionStatus("not_started");
      setSelectedContact(null);
      setMessages([]);
      setContacts([]);
      localStorage.removeItem("wa-session-id");
      setCurrentSession(null);
      toast.success("Sessão desconectada");
    } catch (error) {
      console.warn("Erro ao desconectar sessão:", error);
    }
  }, [isApiAvailable]);

  const createNewSession = useCallback(() => {
    const newSessionId = `session_${Date.now()}`;
    setCurrentSession(newSessionId);
    localStorage.setItem("wa-session-id", newSessionId);
    setConnectionStatus("not_started");
    refreshSessions();
    return newSessionId;
  }, [refreshSessions]);

  const sendMessage = useCallback(async (to: string, body: string) => {
    if (!currentSession || (connectionStatus !== "connected" && isApiAvailable)) {
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

      if (isApiAvailable) {
        const response = await fetch(`${API_URL}/sessions/${currentSession}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to, body })
        });
        
        if (!response.ok) {
          throw new Error("Erro ao enviar mensagem via API");
        }
      }
      
      toast.success("Mensagem enviada");
    } catch (error) {
      console.warn('Erro ao enviar mensagem:', error);
      toast.error("Erro ao enviar mensagem");
    }
  }, [currentSession, connectionStatus, isApiAvailable]);
  
  const fetchMessages = useCallback(async (contactId: string, sessionId: string) => {
    if (!sessionId || !contactId) return;
    
    try {
      setLoadingMessages(true);
      
      if (isApiAvailable) {
        const response = await fetch(`${API_URL}/sessions/${sessionId}/messages/${contactId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
          return;
        }
      }
      
      // Mock messages quando API não disponível
      const mockMessages: WhatsAppMessage[] = [
        {
          id: `msg-${Date.now()}-1`,
          session_id: sessionId,
          number: contactId,
          message: "👋 Olá! Como posso ajudar você hoje?",
          from_me: false,
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: `msg-${Date.now()}-2`,
          session_id: sessionId,
          number: contactId,
          message: "Oi! Tudo bem? Gostaria de saber mais sobre seus serviços.",
          from_me: true,
          created_at: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: `msg-${Date.now()}-3`,
          session_id: sessionId,
          number: contactId,
          message: "Claro! Posso explicar todos os nossos produtos e serviços. Que tipo de solução você está procurando?",
          from_me: false,
          created_at: new Date(Date.now() - 900000).toISOString()
        }
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.warn("Erro ao buscar mensagens:", error);
    } finally {
      setLoadingMessages(false);
    }
  }, [isApiAvailable]);
  
  const refreshData = useCallback(async () => {
    if (!currentSession) return;
    
    try {
      // Refresh contacts and messages
      if (selectedContact) {
        await fetchMessages(selectedContact.phone, currentSession);
      }
      
      if (isApiAvailable) {
        // Buscar contatos atualizados
        const response = await fetch(`${API_URL}/sessions/${currentSession}/contacts`);
        if (response.ok) {
          const contactsData = await response.json();
          setContacts(contactsData);
        }
      }
    } catch (error) {
      console.warn("Erro ao atualizar dados:", error);
    }
  }, [currentSession, selectedContact, fetchMessages, isApiAvailable]);

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

  // Auto-refresh data periodically when connected
  useEffect(() => {
    if (connectionStatus === "connected" && currentSession && isApiAvailable) {
      const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [connectionStatus, currentSession, refreshData, isApiAvailable]);

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
        connectSession,
        disconnectSession,
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
