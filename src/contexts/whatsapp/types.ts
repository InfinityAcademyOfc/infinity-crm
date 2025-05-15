
import { WhatsAppConnectionStatus } from "@/hooks/useQRCode";

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

export interface WhatsAppContextType {
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
