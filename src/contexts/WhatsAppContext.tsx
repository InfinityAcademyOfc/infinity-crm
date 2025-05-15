import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Define types to avoid circular references
export type WhatsAppConnectionStatus = "not_started" | "qr" | "connected" | "error";

export type WhatsAppSession = {
  id: string;
  name?: string;
  status: "CONNECTED" | "DISCONNECTED" | "QRCODE" | "ERROR";
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

  const refreshSessions = async () => {
    try {
      setLoadingSessions(true);
      
      if (!API_URL) {
        throw new Error("API URL is not configured");
      }

      const res = await fetch(`${API_URL}/sessions`);
      if (!res.ok) {
        throw new Error(`Failed to fetch sessions: ${res.status}`);
      }
      
      const data = await res.json();
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

  const fetchConnectionStatus = async (sessionId: string) => {
    if (!sessionId || !API_URL) return;
    
    try {
      const res = await fetch(`${API_URL}/sessions/${sessionId}/status`);
      if (!res.ok) throw new Error(`Failed to fetch status: ${res.status}`);
      
      const data = await res.json();
      setConnectionStatus(data.status as WhatsAppConnectionStatus);
    } catch (error) {
      console.error("Error fetching connection status:", error);
      setConnectionStatus("error");
    }
  };

  const loadContacts = async (sessionId: string) => {
    if (!sessionId) return;
    
    try {
      // First fetch unique numbers from messages
      const { data: messageData, error: messageError } = await supabase
        .from("whatsapp_messages")
        .select("number")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false });
        
      if (messageError) throw messageError;
      
      // Extract unique numbers
      const uniqueNumbers = Array.from(new Set((messageData || []).map(m => m.number)));
      
      // Fetch contact names if available
      const { data: contactData, error: contactError } = await supabase
        .from("contacts")
        .select("name, phone")
        .eq("session_id", sessionId);
        
      if (contactError) throw contactError;
      
      // Create a map of phone number to contact name
      const contactMap = new Map();
      (contactData || []).forEach(contact => {
        contactMap.set(contact.phone, contact.name);
      });
      
      // Create contacts list
      const contactsList = uniqueNumbers.map(number => ({
        id: number,
        number,
        name: contactMap.get(number) || number,
        phone: number
      }));
      
      setContacts(contactsList);
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
  };

  const loadMessages = async (sessionId: string, contactNumber: string) => {
    if (!sessionId || !contactNumber) return;
    
    try {
      setLoadingMessages(true);
      const { data, error } = await supabase
        .from("whatsapp_messages")
        .select("*")
        .eq("session_id", sessionId)
        .eq("number", contactNumber)
        .order("created_at");

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "Error",
        description: "Could not load messages",
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
      console.error("Error connecting session:", error);
      toast({
        title: "Error",
        description: "Could not connect WhatsApp session",
        variant: "destructive",
      });
    }
  };

  const disconnectSession = async (sessionId: string) => {
    try {
      await fetch(`${API_URL}/sessions/${sessionId}/logout`, { method: "POST" });
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

  const sendMessage = async (message: string) => {
    if (!currentSession || !selectedContact || !message.trim()) return;

    try {
      // Send message to backend API
      await fetch(`${API_URL}/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: currentSession,
          number: selectedContact.number || selectedContact.phone,
          message: message.trim()
        })
      });

      // We don't need to add the message manually as it will come through the realtime subscription
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Could not send message",
        variant: "destructive",
      });
    }
  };

  const createNewSession = () => {
    const newSessionId = `session_${Date.now()}`;
    setCurrentSession(newSessionId);
    localStorage.setItem("wa-session-id", newSessionId);
    setConnectionStatus("not_started");
    return newSessionId;
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
          if (selectedContact && (newMsg.number === selectedContact.number || newMsg.number === selectedContact.phone)) {
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
    
    fetchConnectionStatus(currentSession);
    const interval = setInterval(() => fetchConnectionStatus(currentSession), 10000);
    
    return () => clearInterval(interval);
  }, [currentSession]);

  // Load messages when contact is selected
  useEffect(() => {
    if (currentSession && selectedContact) {
      loadMessages(
        currentSession, 
        selectedContact.number || selectedContact.phone || ''
      );
    }
  }, [currentSession, selectedContact]);

  // Load contacts when session changes
  useEffect(() => {
    if (currentSession) {
      loadContacts(currentSession);
    }
  }, [currentSession]);

  // Initial sessions load
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
    throw new Error("useWhatsApp must be used within a WhatsAppProvider");
  }
  return context;
};
