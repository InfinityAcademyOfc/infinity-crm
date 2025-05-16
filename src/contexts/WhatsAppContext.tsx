
import React, { createContext, useContext } from "react";
import { useWhatsAppSessions } from "@/hooks/useWhatsAppSessions";
import { useWhatsAppMessages } from "@/hooks/useWhatsAppMessages";
import { WhatsAppContextType } from "@/types/whatsapp";

// Criar o contexto com um tipo definido
const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export const WhatsAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Usar os hooks customizados para gerenciar estado e lógica
  const sessionsData = useWhatsAppSessions();
  const messagesData = useWhatsAppMessages(sessionsData.currentSession);
  
  // Combinar os valores de ambos os hooks em um único objeto de contexto
  // Isso evita referências circulares que causam o erro de tipo infinito
  const contextValue = {
    // Propriedades e métodos de sessões
    currentSession: sessionsData.currentSession,
    setCurrentSession: sessionsData.setCurrentSession,
    sessions: sessionsData.sessions,
    loadingSessions: sessionsData.loadingSessions,
    connectionStatus: sessionsData.connectionStatus,
    refreshSessions: sessionsData.refreshSessions,
    connectSession: sessionsData.connectSession,
    disconnectSession: sessionsData.disconnectSession,
    createNewSession: sessionsData.createNewSession,
    
    // Propriedades e métodos de mensagens
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

// Hook para usar o contexto
export const useWhatsApp = () => {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error("useWhatsApp deve ser usado dentro de um WhatsAppProvider");
  }
  return context;
};

// Reexportando os tipos para facilitar o uso
export type { 
  WhatsAppConnectionStatus, 
  WhatsAppSession, 
  WhatsAppContact, 
  WhatsAppMessage 
} from "@/types/whatsapp";
