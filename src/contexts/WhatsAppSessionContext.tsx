
import React, { createContext, useContext, useState } from "react";

type WhatsAppConnectionStatus = 'connected' | 'disconnected' | 'qr' | 'error' | 'not_started';

interface WhatsAppSessionContextType {
  sessionId: string | null;
  setSessionId: (sessionId: string | null) => void;
  connectionStatus: WhatsAppConnectionStatus;
  setConnectionStatus: (status: WhatsAppConnectionStatus) => void;
}

const WhatsAppSessionContext = createContext<WhatsAppSessionContextType | undefined>(undefined);

export const WhatsAppSessionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(() => {
    return localStorage.getItem("wa-session-id");
  });
  
  const [connectionStatus, setConnectionStatus] = useState<WhatsAppConnectionStatus>('not_started');

  const updateSessionId = (newSessionId: string | null) => {
    if (newSessionId) {
      localStorage.setItem("wa-session-id", newSessionId);
    } else {
      localStorage.removeItem("wa-session-id");
    }
    setSessionId(newSessionId);
  };

  return (
    <WhatsAppSessionContext.Provider 
      value={{
        sessionId,
        setSessionId: updateSessionId,
        connectionStatus,
        setConnectionStatus,
      }}
    >
      {children}
    </WhatsAppSessionContext.Provider>
  );
};

export const useWhatsAppSession = () => {
  const context = useContext(WhatsAppSessionContext);
  if (context === undefined) {
    throw new Error("useWhatsAppSession must be used within a WhatsAppSessionProvider");
  }
  return context;
};
