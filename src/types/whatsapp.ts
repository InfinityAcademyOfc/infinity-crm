// Tipos básicos para o WhatsApp
export type WhatsAppConnectionStatus = 'connected' | 'disconnected' | 'qr' | 'error' | 'not_started' | 'loading';

export type WhatsAppSession = {
  id: string;
  name?: string;
  status: string; // 'CONNECTED' | 'DISCONNECTED' etc.
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

// Tipos para o contexto separados em categorias
export interface WhatsAppStateProps {
  currentSession: string | null;
  sessions: WhatsAppSession[];
  loadingSessions: boolean;
  connectionStatus: WhatsAppConnectionStatus;
  selectedContact: WhatsAppContact | null;
  contacts: WhatsAppContact[];
  messages: WhatsAppMessage[];
  loadingMessages: boolean;
}

export interface WhatsAppActionsProps {
  setCurrentSession: (sessionId: string | null) => void;
  setSelectedContact: (contact: WhatsAppContact | null) => void;
  refreshSessions: () => Promise<void>;
  connectSession: (sessionId: string) => Promise<void>;
  disconnectSession: (sessionId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  createNewSession: () => string;
}

// Tipo combinado para o contexto completo
export interface WhatsAppContextType extends WhatsAppStateProps, WhatsAppActionsProps {}
