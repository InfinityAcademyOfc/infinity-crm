
// Basic WhatsApp types
export type WhatsAppConnectionStatus = 'connected' | 'disconnected' | 'qr' | 'error' | 'not_started' | 'loading';

export interface WhatsAppSession {
  id: string;
  name?: string;
  status: string; // 'CONNECTED' | 'DISCONNECTED' etc.
}

export interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  number?: string; // Para compatibilidade
  tags?: string[];
  profile_id?: string;
  created_at?: string;
}

export interface WhatsAppMessage {
  id: string;
  session_id: string;
  number: string;
  message: string;
  from_me: boolean;
  created_at: string;
  from?: string; // Para compatibilidade
  to?: string;   // Para compatibilidade
  media_url?: string; // Para mensagens com mídia
  status?: 'sent' | 'delivered' | 'read' | 'failed';
}

// State properties interface
export interface WhatsAppStateProps {
  currentSession: string | null;
  sessions: WhatsAppSession[];
  loadingSessions: boolean;
  connectionStatus: WhatsAppConnectionStatus;
  selectedContact: WhatsAppContact | null;
  contacts: WhatsAppContact[];
  messages: WhatsAppMessage[];
  loadingMessages: boolean;
  isApiAvailable: boolean;
}

// Action methods interface
export interface WhatsAppActionsProps {
  setCurrentSession: (sessionId: string | null) => void;
  setSelectedContact: (contact: WhatsAppContact | null) => void;
  refreshSessions: () => Promise<void>;
  connectSession: (sessionId: string) => Promise<void>;
  disconnectSession: (sessionId: string) => Promise<void>;
  sendMessage: (to: string, body: string, mediaUrl?: string) => Promise<void>;
  createNewSession: () => string;
}

// Complete context type
export interface WhatsAppContextType extends WhatsAppStateProps, WhatsAppActionsProps {}
