
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WhatsAppConnectionStatus } from "@/hooks/useQRCode";
import {
  WhatsAppContextType,
  WhatsAppSession,
  WhatsAppContact,
  WhatsAppMessage
} from "./types";
import {
  fetchSessions,
  fetchConnectionStatus,
  connectWhatsAppSession,
  disconnectWhatsAppSession,
  sendWhatsAppMessage
} from "./services/sessionService";
import { loadContacts } from "./services/contactsService";
import { loadMessages } from "./services/messagesService";
import { WhatsAppContext } from "./WhatsAppContext";

export const WhatsAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<string | null>(() => {
    return localStorage.getItem("wa-session-id") || null;
  });
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<WhatsAppConnectionStatus>("not_started");
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact | null>(null);
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const mountedRef = useRef(true);
  const fetchTimerRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  // Track component mount status to prevent state updates after unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (fetchTimerRef.current !== null) {
        window.clearTimeout(fetchTimerRef.current);
        fetchTimerRef.current = null;
      }
    };
  }, []);

  // Refresh sessions with exponential backoff and retry limits
  const refreshSessions = async () => {
    if (!mountedRef.current) return;
    
    try {
      setLoadingSessions(true);
      const data = await fetchSessions();
      
      if (mountedRef.current) {
        setSessions(data);
        setApiAvailable(true);
        setRetryAttempts(0);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      
      if (!mountedRef.current) return;
      
      setApiAvailable(false);
      
      // Limit retry attempts to prevent excessive API calls
      if (retryAttempts < 3) {
        // Implement exponential backoff (1s, 2s, 4s)
        const backoffTime = Math.pow(2, retryAttempts) * 1000;
        
        toast({
          title: "Não foi possível conectar ao servidor",
          description: `Tentativa ${retryAttempts + 1}/3. Nova tentativa em ${backoffTime/1000}s.`,
          variant: "destructive",
        });
        
        // Schedule retry with backoff
        fetchTimerRef.current = window.setTimeout(() => {
          if (mountedRef.current) {
            setRetryAttempts(prev => prev + 1);
            refreshSessions();
          }
        }, backoffTime);
      } else if (mountedRef.current) {
        toast({
          title: "Erro de conexão",
          description: "Servidor WhatsApp indisponível no momento. Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    } finally {
      if (mountedRef.current) {
        setLoadingSessions(false);
      }
    }
  };

  // Connect to a session
  const connectSession = async (sessionId: string) => {
    if (!apiAvailable) {
      toast({
        title: "Servidor indisponível",
        description: "Não foi possível conectar ao servidor WhatsApp.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await connectWhatsAppSession(sessionId);
      setCurrentSession(sessionId);
      localStorage.setItem("wa-session-id", sessionId);
      await updateConnectionStatus(sessionId);
    } catch (error) {
      console.error("Error connecting session:", error);
      toast({
        title: "Erro",
        description: "Não foi possível conectar a sessão WhatsApp",
        variant: "destructive",
      });
    }
  };

  // Disconnect from a session
  const disconnectSession = async (sessionId: string) => {
    if (!apiAvailable) {
      toast({
        title: "Servidor indisponível",
        description: "Não foi possível desconectar do servidor WhatsApp.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await disconnectWhatsAppSession(sessionId);
      setConnectionStatus("not_started");
      toast({ 
        title: "Desconectado", 
        description: "Sessão WhatsApp encerrada." 
      });
      await refreshSessions();
    } catch (error) {
      console.error("Error disconnecting session:", error);
      toast({
        title: "Erro",
        description: "Não foi possível desconectar a sessão WhatsApp",
        variant: "destructive",
      });
    }
  };

  // Send a message
  const sendMessage = async (message: string) => {
    if (!currentSession || !selectedContact || !message.trim() || !apiAvailable) return;

    try {
      await sendWhatsAppMessage(
        currentSession,
        selectedContact.number || selectedContact.phone || '',
        message.trim()
      );
      // Message will be added through the realtime subscription
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar mensagem",
        variant: "destructive",
      });
    }
  };

  // Create a new session
  const createNewSession = (): string => {
    const newSessionId = `session_${Date.now()}`;
    setCurrentSession(newSessionId);
    localStorage.setItem("wa-session-id", newSessionId);
    setConnectionStatus("not_started");
    return newSessionId;
  };

  // Update the connection status
  const updateConnectionStatus = async (sessionId: string) => {
    if (!sessionId || !apiAvailable) return;
    
    try {
      const status = await fetchConnectionStatus(sessionId);
      if (mountedRef.current) {
        setConnectionStatus(status);
      }
    } catch (error) {
      console.error("Error updating connection status:", error);
    }
  };

  // Manual retry connection
  const retryConnection = () => {
    setRetryAttempts(0);
    setApiAvailable(true);
    refreshSessions();
  };

  // Set up realtime listener for new messages
  useEffect(() => {
    if (!currentSession || !selectedContact) return;
    
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
            mountedRef.current && 
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

  // Load session status periodically
  useEffect(() => {
    if (!currentSession || !apiAvailable) return;
    
    // Initial update
    updateConnectionStatus(currentSession);
    
    // Set up interval for updates
    const interval = setInterval(() => {
      if (mountedRef.current) {
        updateConnectionStatus(currentSession);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [currentSession, apiAvailable]);

  // Load messages when contact is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentSession || !selectedContact || !apiAvailable) return;
      
      try {
        if (mountedRef.current) {
          setLoadingMessages(true);
        }
        
        const data = await loadMessages(
          currentSession, 
          selectedContact.number || selectedContact.phone || ''
        );
        
        if (mountedRef.current) {
          setMessages(data);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        if (mountedRef.current) {
          setLoadingMessages(false);
        }
      }
    };
    
    fetchMessages();
  }, [currentSession, selectedContact, apiAvailable]);

  // Load contacts when session changes
  useEffect(() => {
    const fetchContacts = async () => {
      if (!currentSession || !apiAvailable) return;
      
      try {
        const contactsData = await loadContacts(currentSession);
        if (mountedRef.current) {
          setContacts(contactsData);
        }
      } catch (error) {
        console.error("Error loading contacts:", error);
      }
    };
    
    fetchContacts();
  }, [currentSession, apiAvailable]);

  // Initial sessions load
  useEffect(() => {
    refreshSessions();
    
    // Set up periodic refresh
    const interval = setInterval(() => {
      if (mountedRef.current && apiAvailable) {
        refreshSessions();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [apiAvailable]);

  // Create the context value object explicitly matching the interface
  const contextValue: WhatsAppContextType = {
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
  };

  return (
    <WhatsAppContext.Provider value={contextValue}>
      {!apiAvailable && retryAttempts >= 3 && (
        <div className="fixed bottom-4 right-4 z-50 bg-destructive text-white p-4 rounded-lg shadow-lg max-w-md">
          <h4 className="font-bold mb-2">Servidor WhatsApp indisponível</h4>
          <p className="mb-2 text-sm">O servidor de WhatsApp está indisponível no momento. Algumas funcionalidades podem estar limitadas.</p>
          <button
            onClick={retryConnection}
            className="bg-white text-destructive px-4 py-1 rounded text-sm font-medium hover:bg-gray-100"
          >
            Tentar novamente
          </button>
        </div>
      )}
      {children}
    </WhatsAppContext.Provider>
  );
};
