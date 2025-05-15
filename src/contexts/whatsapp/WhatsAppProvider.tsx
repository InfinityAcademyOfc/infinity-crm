
import React, { useState, useEffect } from "react";
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
  const { toast } = useToast();

  // Refresh sessions
  const refreshSessions = async () => {
    try {
      setLoadingSessions(true);
      const data = await fetchSessions();
      setSessions(data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast({
        title: "Error",
        description: "Could not fetch WhatsApp sessions",
        variant: "destructive",
      });
    } finally {
      setLoadingSessions(false);
    }
  };

  // Connect to a session
  const connectSession = async (sessionId: string) => {
    try {
      await connectWhatsAppSession(sessionId);
      setCurrentSession(sessionId);
      localStorage.setItem("wa-session-id", sessionId);
      await updateConnectionStatus(sessionId);
    } catch (error) {
      console.error("Error connecting session:", error);
      toast({
        title: "Error",
        description: "Could not connect WhatsApp session",
        variant: "destructive",
      });
    }
  };

  // Disconnect from a session
  const disconnectSession = async (sessionId: string) => {
    try {
      await disconnectWhatsAppSession(sessionId);
      setConnectionStatus("not_started");
      toast({ 
        title: "Disconnected", 
        description: "WhatsApp session ended." 
      });
      await refreshSessions();
    } catch (error) {
      console.error("Error disconnecting session:", error);
      toast({
        title: "Error",
        description: "Could not disconnect WhatsApp session",
        variant: "destructive",
      });
    }
  };

  // Send a message
  const sendMessage = async (message: string) => {
    if (!currentSession || !selectedContact || !message.trim()) return;

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
        title: "Error",
        description: "Could not send message",
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
    if (!sessionId) return;
    const status = await fetchConnectionStatus(sessionId);
    setConnectionStatus(status);
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
    if (!currentSession) return;
    
    updateConnectionStatus(currentSession);
    const interval = setInterval(() => updateConnectionStatus(currentSession), 10000);
    
    return () => clearInterval(interval);
  }, [currentSession]);

  // Load messages when contact is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentSession || !selectedContact) return;
      
      try {
        setLoadingMessages(true);
        const data = await loadMessages(
          currentSession, 
          selectedContact.number || selectedContact.phone || ''
        );
        setMessages(data);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setLoadingMessages(false);
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
        setContacts(contactsData);
      } catch (error) {
        console.error("Error loading contacts:", error);
      }
    };
    
    fetchContacts();
  }, [currentSession]);

  // Initial sessions load
  useEffect(() => {
    refreshSessions();
    const interval = setInterval(refreshSessions, 30000);
    return () => clearInterval(interval);
  }, []);

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
      {children}
    </WhatsAppContext.Provider>
  );
};
