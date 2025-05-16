
import React, { createContext, useContext } from "react";
import { useWhatsAppSessions } from "@/hooks/useWhatsAppSessions";
import { useWhatsAppMessages, WhatsAppMessagesHookResult } from "@/hooks/useWhatsAppMessages";
import { WhatsAppContextType } from "@/types/whatsapp";

// Create context with a defined type
const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export const WhatsAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use custom hooks to manage state and logic
  const sessionsData = useWhatsAppSessions();
  const messagesData = useWhatsAppMessages(sessionsData.currentSession);
  
  // Combine values from both hooks into a single context object
  const contextValue: WhatsAppContextType = {
    // Session properties and methods
    currentSession: sessionsData.currentSession,
    setCurrentSession: sessionsData.setCurrentSession,
    sessions: sessionsData.sessions,
    loadingSessions: sessionsData.loadingSessions,
    connectionStatus: sessionsData.connectionStatus,
    refreshSessions: sessionsData.refreshSessions,
    connectSession: sessionsData.connectSession,
    disconnectSession: sessionsData.disconnectSession,
    createNewSession: sessionsData.createNewSession,
    
    // Message properties and methods
    selectedContact: messagesData.selectedContact,
    setSelectedContact: messagesData.setSelectedContact,
    contacts: messagesData.contacts,
    messages: messagesData.messages,
    loadingMessages: messagesData.loadingMessages,
    sendMessage: messagesData.sendMessage
  };

  return (
    <WhatsAppContext.Provider value={contextValue}>
      {children}
    </WhatsAppContext.Provider>
  );
};

// Hook to use the context
export const useWhatsApp = () => {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error("useWhatsApp deve ser usado dentro de um WhatsAppProvider");
  }
  return context;
};

// Re-export types for easier access
export type { 
  WhatsAppConnectionStatus, 
  WhatsAppSession, 
  WhatsAppContact, 
  WhatsAppMessage 
} from "@/types/whatsapp";
