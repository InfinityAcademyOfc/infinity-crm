
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { WhatsAppContact, WhatsAppMessage, WhatsAppConnectionStatus, WhatsAppSession } from "@/types/whatsapp";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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
  isApiAvailable: boolean;
}

const WhatsAppContext = createContext<WhatsAppContextType>({} as WhatsAppContextType);

const API_URL = import.meta.env.VITE_API_URL || "";

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
  // Estados locais para evitar dependência circular
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [currentSession, setCurrentSession] = useState<string | null>(
    () => localStorage.getItem("wa-session-id") || null
  );
  const [connectionStatus, setConnectionStatus] = useState<WhatsAppConnectionStatus>("not_started");
  const [isApiAvailable, setIsApiAvailable] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState(0);
  
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact | null>(null);
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const { toast: toastHook } = useToast();
  const isConnected = connectionStatus === "connected" && !!currentSession;
  
  const refreshSessions = useCallback(async () => {
    if (!API_URL) {
      setLoadingSessions(false);
      setSessions([]);
      setIsApiAvailable(false);
      return;
    }
    
    setLoadingSessions(true);
    try {
      // Tenta buscar sessões do banco de dados local primeiro
      const { data: localSessions, error: localError } = await supabase
        .from("whatsapp_sessions")
        .select("*")
        .order("created_at", { ascending: false });
      
      // Se houver sessões locais, usamos essas enquanto tentamos sincronizar com a API
      if (localSessions && localSessions.length > 0) {
        const formattedSessions = localSessions.map(s => ({
          id: s.session_id,
          name: s.name || `Sessão ${s.session_id.substring(0, 8)}`,
          status: s.status
        }));
        setSessions(formattedSessions);
      }
      
      // Agora tenta buscar da API do WhatsApp
      const res = await fetch(`${API_URL}/sessions`, {
        signal: AbortSignal.timeout(8000),
        cache: 'no-store'
      });
      
      if (!res.ok) {
        console.warn(`Não foi possível obter as sessões: ${res.status}`);
        
        if (res.status === 404) {
          setIsApiAvailable(false);
          if (localSessions && localSessions.length > 0) {
            // Já carregamos acima, não precisamos fazer nada
          } else if (currentSession) {
            const mockSessions: WhatsAppSession[] = [
              {
                id: currentSession,
                name: "Meu WhatsApp",
                status: "not_started"
              }
            ];
            setSessions(mockSessions);
          }
        }
        return;
      }
      
      const data = await res.json();
      setSessions(data || []);
      setIsApiAvailable(true);
      
      // Sincronizar as sessões da API com o banco de dados local
      if (data && data.length > 0) {
        for (const session of data) {
          await supabase
            .from("whatsapp_sessions")
            .upsert({
              session_id: session.id,
              name: session.name,
              status: session.status,
              is_connected: session.status === "connected",
              updated_at: new Date().toISOString()
            })
            .eq("session_id", session.id);
        }
      }
    } catch (error) {
      console.warn("Erro ao atualizar sessões:", error);
      setIsApiAvailable(false);
      
      if (sessions.length === 0 && currentSession) {
        setSessions([{
          id: currentSession,
          name: "Meu WhatsApp",
          status: "not_started"
        }]);
      }
      
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          refreshSessions();
        }, 3000);
      }
    } finally {
      setLoadingSessions(false);
      setRetryCount(0);
    }
  }, [API_URL, currentSession, sessions.length, retryCount]);

  const fetchConnectionStatus = useCallback(async (sessionId: string) => {
    if (!API_URL || !sessionId) {
      setConnectionStatus("not_started");
      return;
    }
    
    try {
      const { data: localSession } = await supabase
        .from("whatsapp_sessions")
        .select("status")
        .eq("session_id", sessionId)
        .single();
        
      if (localSession) {
        setConnectionStatus(localSession.status as WhatsAppConnectionStatus);
      }
      
      const res = await fetch(`${API_URL}/sessions/${sessionId}/status`, {
        signal: AbortSignal.timeout(8000),
        cache: 'no-store'
      });
      
      if (!res.ok) {
        console.warn(`Não foi possível obter status para ${sessionId}: ${res.status}`);
        if (res.status === 404) {
          setIsApiAvailable(false);
        }
        return;
      }
      
      setIsApiAvailable(true);
      const data = await res.json();
      const status = data?.status as WhatsAppConnectionStatus || "not_started";
      setConnectionStatus(status);
      
      await supabase
        .from("whatsapp_sessions")
        .upsert({
          session_id: sessionId,
          status,
          is_connected: status === "connected",
          updated_at: new Date().toISOString()
        })
        .eq("session_id", sessionId);
    } catch (error) {
      console.warn("Erro ao obter status da sessão:", error);
    }
  }, [API_URL]);

  const connectSession = useCallback(async (sessionId: string) => {
    if (!API_URL || !sessionId) return;
    
    try {
      setConnectionStatus("loading");
      
      const res = await fetch(`${API_URL}/sessions/${sessionId}/qr`, { 
        method: "GET",
        signal: AbortSignal.timeout(10000),
        cache: 'no-store'
      });
      
      if (!res.ok && res.status !== 202) {
        if (res.status === 404) {
          setIsApiAvailable(false);
          toastHook({ 
            title: "Modo offline",
            description: "Sistema funcionando em modo simulado"
          });
          setCurrentSession(sessionId);
          localStorage.setItem("wa-session-id", sessionId);
          
          await supabase
            .from("whatsapp_sessions")
            .upsert({
              session_id: sessionId,
              name: `Sessão ${sessionId.substring(0, 8)}`,
              status: "not_started",
              updated_at: new Date().toISOString()
            })
            .eq("session_id", sessionId);
            
          return;
        }
        throw new Error("Erro ao conectar sessão");
      }
      
      setIsApiAvailable(true);
      setCurrentSession(sessionId);
      localStorage.setItem("wa-session-id", sessionId);
      
      await supabase
        .from("whatsapp_sessions")
        .upsert({
          session_id: sessionId,
          name: `Sessão ${sessionId.substring(0, 8)}`,
          status: "qr",
          updated_at: new Date().toISOString()
        })
        .eq("session_id", sessionId);
        
      await fetchConnectionStatus(sessionId);
    } catch (error) {
      console.warn("Erro ao conectar sessão:", error);
      
      toastHook({
        title: "Erro na conexão",
        description: "Usando modo simulado temporariamente"
      });
      setCurrentSession(sessionId);
      localStorage.setItem("wa-session-id", sessionId);
      
      await supabase
        .from("whatsapp_sessions")
        .upsert({
          session_id: sessionId,
          name: `Sessão ${sessionId.substring(0, 8)}`,
          status: "error",
          updated_at: new Date().toISOString()
        })
        .eq("session_id", sessionId);
    }
  }, [API_URL, fetchConnectionStatus, toastHook]);

  const disconnectSession = useCallback(async (sessionId: string) => {
    if (!sessionId) return;
    
    try {
      if (isApiAvailable && API_URL) {
        const res = await fetch(`${API_URL}/sessions/${sessionId}/logout`, { 
          method: "POST",
          cache: 'no-store'
        });
        
        if (!res.ok) {
          console.warn(`Erro ao desconectar: ${res.status}`);
        }
      }
      
      setConnectionStatus("not_started");
      
      await supabase
        .from("whatsapp_sessions")
        .upsert({
          session_id: sessionId,
          status: "not_started",
          is_connected: false,
          updated_at: new Date().toISOString()
        })
        .eq("session_id", sessionId);
        
      await refreshSessions();
    } catch (error) {
      console.warn("Erro ao desconectar sessão:", error);
    }
  }, [API_URL, refreshSessions, isApiAvailable]);

  const createNewSession = useCallback(() => {
    const newSessionId = `session_${Date.now()}`;
    setCurrentSession(newSessionId);
    localStorage.setItem("wa-session-id", newSessionId);
    setConnectionStatus("not_started");
    
    supabase
      .from("whatsapp_sessions")
      .insert({
        session_id: newSessionId,
        name: `Sessão ${newSessionId.substring(0, 8)}`,
        status: "not_started",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .then(() => {
        refreshSessions();
      });
      
    return newSessionId;
  }, [refreshSessions]);

  const sendMessage = useCallback(async (to: string, body: string) => {
    if (!currentSession || !isConnected) {
      toast("Nenhuma sessão WhatsApp conectada", { 
        description: "Conecte uma sessão antes de enviar mensagens"
      });
      return;
    }
    
    try {
      const tempId = `temp-${Date.now()}`;
      
      const tempMessage: WhatsAppMessage = {
        id: tempId,
        session_id: currentSession,
        number: to,
        message: body,
        from_me: true,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, tempMessage]);
      
      const response = await fetch(`${API_URL}/sessions/${currentSession}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number: to, message: body }),
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error('Falha ao enviar mensagem');
      }
      
      setTimeout(() => {
        if (selectedContact) {
          fetchMessages(selectedContact.phone, currentSession);
        }
      }, 1000);
      
    } catch (error) {
      console.warn('Erro ao enviar mensagem:', error);
      toast("Falha ao enviar mensagem", {
        description: "Tente novamente em alguns instantes"
      });
    }
  }, [currentSession, isConnected, selectedContact, API_URL]);
  
  const fetchMessages = useCallback(async (contactId: string, sessionId: string) => {
    if (!sessionId || !contactId || !API_URL || !isConnected) return;
    
    try {
      setLoadingMessages(true);
      const messagesResponse = await fetch(`${API_URL}/sessions/${sessionId}/messages/${contactId}`, {
        signal: AbortSignal.timeout(8000)
      });
      
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);
      } else {
        console.warn("Erro ao buscar mensagens:", messagesResponse.status);
        
        if (messagesResponse.status === 404) {
          const mockMessages = [
            {
              id: `local-${Date.now()}-1`,
              session_id: sessionId,
              number: contactId,
              message: "👋 Bem-vindo ao chat do WhatsApp",
              from_me: false,
              created_at: new Date().toISOString()
            }
          ];
          setMessages(mockMessages);
        }
      }
    } catch (error) {
      console.warn("Erro ao buscar mensagens:", error);
      
      const mockMessages = [
        {
          id: `local-${Date.now()}-1`,
          session_id: sessionId,
          number: contactId,
          message: "👋 Bem-vindo ao chat do WhatsApp",
          from_me: false,
          created_at: new Date().toISOString()
        }
      ];
      setMessages(mockMessages);
    } finally {
      setLoadingMessages(false);
    }
  }, [isConnected, API_URL]);
  
  const refreshData = useCallback(async () => {
    if (!currentSession || !API_URL || !isConnected) return;
    
    try {
      const contactsResponse = await fetch(`${API_URL}/sessions/${currentSession}/contacts`, {
        signal: AbortSignal.timeout(8000)
      });
      
      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        setContacts(contactsData);
      } else if (contactsResponse.status === 404) {
        const mockContacts = [
          { id: "1", name: "João Silva", phone: "+5511999998888" },
          { id: "2", name: "Maria Oliveira", phone: "+5511987654321" },
          { id: "3", name: "Suporte Infinity CRM", phone: "+5511912345678" }
        ];
        setContacts(mockContacts);
      }
      
      if (selectedContact) {
        await fetchMessages(selectedContact.phone, currentSession);
      }
    } catch (error) {
      console.warn("Erro ao atualizar dados do WhatsApp:", error);
      
      const mockContacts = [
        { id: "1", name: "João Silva", phone: "+5511999998888" },
        { id: "2", name: "Maria Oliveira", phone: "+5511987654321" },
        { id: "3", name: "Suporte Infinity CRM", phone: "+5511912345678" }
      ];
      setContacts(mockContacts);
    }
  }, [currentSession, selectedContact, fetchMessages, isConnected, API_URL]);

  const connect = useCallback(async (id: string) => {
    if (!API_URL) return;
    
    try {
      await connectSession(id);
    } catch (error) {
      console.warn("Erro ao conectar sessão:", error);
    }
  }, [connectSession, API_URL]);

  const disconnect = useCallback(async () => {
    if (!currentSession || !API_URL) return;
    
    try {
      await disconnectSession(currentSession);
      setSelectedContact(null);
      setMessages([]);
      toast("Sessão desconectada com sucesso");
    } catch (error) {
      console.warn("Erro ao desconectar sessão:", error);
    }
  }, [currentSession, disconnectSession, API_URL]);

  // Efeito para atualizar o status de conexão
  useEffect(() => {
    if (!currentSession) return;

    fetchConnectionStatus(currentSession);

    const interval = setInterval(() => fetchConnectionStatus(currentSession), 15000);
    return () => clearInterval(interval);
  }, [currentSession, fetchConnectionStatus]);

  // Efeito para atualizar a lista de sessões
  useEffect(() => {
    refreshSessions();
    
    const interval = setInterval(refreshSessions, 30000);
    return () => clearInterval(interval);
  }, [refreshSessions]);

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
  }, [isConnected, currentSession]);

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
        
        // Propriedades para WhatsAppIntegration.tsx
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
