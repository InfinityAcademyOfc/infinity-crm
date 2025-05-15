
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
  sendWhatsAppMessage,
  resetCircuitBreaker,
  validateApiConnection
} from "./services/sessionService";
import { loadContacts } from "./services/contactsService";
import { loadMessages } from "./services/messagesService";
import { WhatsAppContext } from "./WhatsAppContext";

// Key for storing offline mode preference
const OFFLINE_MODE_KEY = "wa-offline-mode";

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
  const [offlineMode, setOfflineMode] = useState<boolean>(() => {
    return localStorage.getItem(OFFLINE_MODE_KEY) === "true";
  });
  const [lastApiError, setLastApiError] = useState<string | null>(null);
  const [errorNotified, setErrorNotified] = useState(false);
  
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

  // Toggle offline mode
  const toggleOfflineMode = (value: boolean) => {
    setOfflineMode(value);
    localStorage.setItem(OFFLINE_MODE_KEY, value.toString());
    
    if (!value) {
      // When turning offline mode off, try to reconnect
      resetCircuitBreaker();
      refreshSessions();
    }
  };

  // Initial API availability check
  useEffect(() => {
    const checkApiAvailability = async () => {
      if (offlineMode) return;
      
      const isAvailable = await validateApiConnection();
      if (mountedRef.current) {
        setApiAvailable(isAvailable);
        
        if (!isAvailable && !errorNotified) {
          toast({
            title: "Servidor WhatsApp indisponível",
            description: "O sistema funcionará no modo offline. Algumas funcionalidades estarão limitadas.",
            variant: "destructive",
          });
          setErrorNotified(true);
        }
      }
    };
    
    checkApiAvailability();
    
    // Check API availability periodically but not too frequently
    const interval = setInterval(checkApiAvailability, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, [toast, offlineMode, errorNotified]);

  // Refresh sessions with error management
  const refreshSessions = async () => {
    if (!mountedRef.current || offlineMode) return;
    
    try {
      setLoadingSessions(true);
      
      // Validate API is available first
      const apiCheck = await validateApiConnection();
      if (!apiCheck) {
        if (mountedRef.current) {
          setApiAvailable(false);
          if (!errorNotified) {
            toast({
              title: "Servidor WhatsApp indisponível",
              description: "O sistema funcionará no modo offline. Algumas funcionalidades estarão limitadas.",
              variant: "destructive",
            });
            setErrorNotified(true);
          }
          setLoadingSessions(false);
        }
        return;
      }
      
      const data = await fetchSessions();
      
      if (mountedRef.current) {
        setSessions(data);
        setApiAvailable(true);
        setLastApiError(null);
        setErrorNotified(false);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      
      if (!mountedRef.current) return;
      
      setApiAvailable(false);
      setLastApiError(error instanceof Error ? error.message : "Unknown error");
      
      // Only show error toast once
      if (!errorNotified) {
        toast({
          title: "Erro de conexão",
          description: "Servidor WhatsApp indisponível no momento. Modo offline ativado.",
          variant: "destructive",
        });
        setErrorNotified(true);
      }
    } finally {
      if (mountedRef.current) {
        setLoadingSessions(false);
      }
    }
  };

  // Connect to a session
  const connectSession = async (sessionId: string) => {
    if (offlineMode || !apiAvailable) {
      toast({
        title: "Modo offline ativo",
        description: "Desative o modo offline para conectar ao WhatsApp.",
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
    if (offlineMode || !apiAvailable) {
      toast({
        title: "Modo offline ativo",
        description: "Desative o modo offline para desconectar do WhatsApp.",
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
    if (!currentSession || !selectedContact || !message.trim() || offlineMode || !apiAvailable) {
      if (offlineMode || !apiAvailable) {
        toast({
          title: "Modo offline ativo",
          description: "Não é possível enviar mensagens no modo offline.",
          variant: "destructive",
        });
      }
      return;
    }

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
    if (!sessionId || offlineMode || !apiAvailable) return;
    
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
    resetCircuitBreaker();
    setApiAvailable(true);
    setErrorNotified(false);
    setLastApiError(null);
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
    if (!currentSession || offlineMode || !apiAvailable) return;
    
    // Initial update
    updateConnectionStatus(currentSession);
    
    // Set up interval for updates
    const interval = setInterval(() => {
      if (mountedRef.current && !offlineMode && apiAvailable) {
        updateConnectionStatus(currentSession);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [currentSession, apiAvailable, offlineMode]);

  // Load messages when contact is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentSession || !selectedContact) return;
      
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
  }, [currentSession, selectedContact]);

  // Load contacts when session changes
  useEffect(() => {
    const fetchContacts = async () => {
      if (!currentSession) return;
      
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
  }, [currentSession]);

  // Initial sessions load
  useEffect(() => {
    if (!offlineMode) {
      refreshSessions();
      
      // Set up periodic refresh with much less frequency to avoid overwhelming
      const interval = setInterval(() => {
        if (mountedRef.current && !offlineMode && apiAvailable) {
          refreshSessions();
        }
      }, 60000); // Once per minute instead of every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [apiAvailable, offlineMode]);

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
    offlineMode,
    toggleOfflineMode,
    retryConnection,
  };

  return (
    <WhatsAppContext.Provider value={contextValue}>
      {!apiAvailable && !offlineMode && (
        <div className="fixed bottom-4 right-4 z-50 bg-destructive text-white p-4 rounded-lg shadow-lg max-w-md">
          <h4 className="font-bold mb-2">Servidor WhatsApp indisponível</h4>
          <p className="mb-2 text-sm">O servidor de WhatsApp está indisponível no momento. Algumas funcionalidades podem estar limitadas.</p>
          <div className="flex space-x-2">
            <button
              onClick={retryConnection}
              className="bg-white text-destructive px-4 py-1 rounded text-sm font-medium hover:bg-gray-100"
            >
              Tentar novamente
            </button>
            <button
              onClick={() => toggleOfflineMode(true)}
              className="bg-transparent border border-white text-white px-4 py-1 rounded text-sm font-medium hover:bg-white/10"
            >
              Modo offline
            </button>
          </div>
        </div>
      )}
      {offlineMode && (
        <div className="fixed top-16 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 text-center text-sm shadow-lg mx-auto max-w-max rounded-lg">
          <span className="font-medium">Modo offline ativado</span>
          <button 
            onClick={() => toggleOfflineMode(false)}
            className="ml-2 underline text-white hover:text-white/80"
          >
            Desativar
          </button>
        </div>
      )}
      {children}
    </WhatsAppContext.Provider>
  );
};
