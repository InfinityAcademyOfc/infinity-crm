
import { useState, useEffect, useCallback } from "react";
import { WhatsAppSession, WhatsAppConnectionStatus } from "@/types/whatsapp";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "";

export interface WhatsAppSessionsHookResult {
  sessions: WhatsAppSession[];
  loadingSessions: boolean;
  currentSession: string | null;
  setCurrentSession: (sessionId: string | null) => void;
  connectionStatus: WhatsAppConnectionStatus;
  refreshSessions: () => Promise<void>;
  connectSession: (sessionId: string) => Promise<void>;
  disconnectSession: (sessionId: string) => Promise<void>;
  createNewSession: () => string;
}

export function useWhatsAppSessions(): WhatsAppSessionsHookResult {
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [currentSession, setCurrentSession] = useState<string | null>(
    () => localStorage.getItem("wa-session-id") || null
  );
  const [connectionStatus, setConnectionStatus] = useState<WhatsAppConnectionStatus>("not_started");
  const { toast } = useToast();
  
  const refreshSessions = useCallback(async () => {
    if (!API_URL) {
      setLoadingSessions(false);
      setSessions([]);
      return;
    }
    
    setLoadingSessions(true);
    try {
      const res = await fetch(`${API_URL}/sessions`, {
        signal: AbortSignal.timeout(8000)
      });
      
      if (!res.ok) {
        console.warn(`Não foi possível obter as sessões: ${res.status}`);
        setSessions([]);
        return;
      }
      
      const data = await res.json();
      setSessions(data || []);
    } catch (error) {
      console.warn("Erro ao atualizar sessões:", error);
      // Não limpa as sessões existentes em caso de erro temporário
    } finally {
      setLoadingSessions(false);
    }
  }, [API_URL]);

  const fetchConnectionStatus = useCallback(async (sessionId: string) => {
    if (!API_URL || !sessionId) {
      setConnectionStatus("not_started");
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/sessions/${sessionId}/status`, {
        signal: AbortSignal.timeout(8000)
      });
      
      if (!res.ok) {
        console.warn(`Não foi possível obter status para ${sessionId}: ${res.status}`);
        return;
      }
      
      const data = await res.json();
      setConnectionStatus(data?.status as WhatsAppConnectionStatus || "not_started");
    } catch (error) {
      console.warn("Erro ao obter status da sessão:", error);
      // Não alteramos o status em caso de erro de rede temporário
    }
  }, [API_URL]);

  const connectSession = useCallback(async (sessionId: string) => {
    if (!API_URL || !sessionId) return;
    
    try {
      // O endpoint de QR já inicia a sessão
      const res = await fetch(`${API_URL}/sessions/${sessionId}/qr`, { 
        method: "GET",
        signal: AbortSignal.timeout(10000)
      });
      
      if (!res.ok && res.status !== 202) {
        throw new Error("Erro ao conectar sessão");
      }
      
      setCurrentSession(sessionId);
      localStorage.setItem("wa-session-id", sessionId);
      await fetchConnectionStatus(sessionId);
    } catch (error) {
      console.warn("Erro ao conectar sessão:", error);
    }
  }, [API_URL, fetchConnectionStatus]);

  const disconnectSession = useCallback(async (sessionId: string) => {
    if (!API_URL || !sessionId) return;
    
    try {
      const res = await fetch(`${API_URL}/sessions/${sessionId}/logout`, { method: "POST" });
      
      if (!res.ok) {
        console.warn(`Erro ao desconectar: ${res.status}`);
      }
      
      setConnectionStatus("not_started");
      await refreshSessions();
    } catch (error) {
      console.warn("Erro ao desconectar sessão:", error);
    }
  }, [API_URL, refreshSessions]);

  const createNewSession = useCallback(() => {
    const newSessionId = `session_${Date.now()}`;
    setCurrentSession(newSessionId);
    localStorage.setItem("wa-session-id", newSessionId);
    setConnectionStatus("not_started");
    return newSessionId;
  }, []);

  // Efeito para atualizar o status de conexão
  useEffect(() => {
    if (!currentSession) return;

    fetchConnectionStatus(currentSession);

    const interval = setInterval(() => fetchConnectionStatus(currentSession), 15000);
    return () => clearInterval(interval);
  }, [currentSession, fetchConnectionStatus]);

  // Efeito para atualizar a lista de sessões
  useEffect(() => {
    refreshSessions();
    
    const interval = setInterval(refreshSessions, 30000);
    return () => clearInterval(interval);
  }, [refreshSessions]);

  return {
    sessions,
    loadingSessions,
    currentSession,
    setCurrentSession,
    connectionStatus,
    refreshSessions,
    connectSession,
    disconnectSession,
    createNewSession
  };
}
