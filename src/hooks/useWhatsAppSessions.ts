
import { useState, useEffect } from "react";
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
  
  // Flag to track if API is available
  const [isApiAvailable, setIsApiAvailable] = useState<boolean | null>(null);
  
  // Check API availability
  useEffect(() => {
    if (!API_URL) {
      setIsApiAvailable(false);
      setLoadingSessions(false);
      return;
    }
    
    // Simple health check to determine if API is available
    const checkApiAvailability = async () => {
      try {
        const res = await fetch(`${API_URL}/health`, { 
          method: 'GET',
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        setIsApiAvailable(res.ok);
      } catch (error) {
        console.log("WhatsApp API unavailable:", error);
        setIsApiAvailable(false);
      } finally {
        setLoadingSessions(false);
      }
    };
    
    checkApiAvailability();
  }, [API_URL]);

  const refreshSessions = async () => {
    if (!API_URL || !isApiAvailable) {
      setLoadingSessions(false);
      return;
    }
    
    setLoadingSessions(true);
    try {
      const res = await fetch(`${API_URL}/sessions`);
      if (!res.ok) throw new Error(`Erro ao buscar sessões: ${res.status}`);
      const data = await res.json();
      setSessions(data);
    } catch (error) {
      console.error("Erro ao atualizar sessões:", error);
      // Don't show toast for connection errors to reduce notification spam
    } finally {
      setLoadingSessions(false);
    }
  };

  const fetchConnectionStatus = async (sessionId: string) => {
    if (!API_URL || !isApiAvailable || !sessionId) {
      setConnectionStatus("not_started");
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/sessions/${sessionId}/status`);
      if (!res.ok) throw new Error(`Erro ao buscar status: ${res.status}`);
      const data = await res.json();
      setConnectionStatus(data?.status as WhatsAppConnectionStatus || "not_started");
    } catch (error) {
      console.error("Erro ao obter status da sessão:", error);
      setConnectionStatus("error");
    }
  };

  const connectSession = async (sessionId: string) => {
    if (!API_URL || !isApiAvailable || !sessionId) {
      toast({
        title: "API indisponível",
        description: "O serviço de WhatsApp não está disponível no momento",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/sessions/${sessionId}/start`, { method: "POST" });
      if (!res.ok) throw new Error("Erro ao conectar sessão");
      setCurrentSession(sessionId);
      localStorage.setItem("wa-session-id", sessionId);
      await fetchConnectionStatus(sessionId);
      
      // Don't show success toast here - let QRCode component handle it after successful scan
    } catch (error) {
      console.error("Erro ao conectar sessão:", error);
      toast({
        title: "Erro",
        description: "Não foi possível conectar à sessão do WhatsApp",
        variant: "destructive"
      });
    }
  };

  const disconnectSession = async (sessionId: string) => {
    if (!API_URL || !isApiAvailable || !sessionId) return;
    
    try {
      const res = await fetch(`${API_URL}/sessions/${sessionId}/logout`, { method: "POST" });
      if (!res.ok) throw new Error("Erro ao desconectar sessão");
      setConnectionStatus("not_started");
      await refreshSessions();
    } catch (error) {
      console.error("Erro ao desconectar sessão:", error);
      // Don't show error toast - if disconnect fails, don't distract user
    }
  };

  const createNewSession = () => {
    const newSessionId = `session_${Date.now()}`;
    setCurrentSession(newSessionId);
    localStorage.setItem("wa-session-id", newSessionId);
    setConnectionStatus("not_started");
    return newSessionId;
  };

  useEffect(() => {
    if (!currentSession || !isApiAvailable) return;

    fetchConnectionStatus(currentSession);

    const interval = setInterval(() => fetchConnectionStatus(currentSession), 10000);
    return () => clearInterval(interval);
  }, [currentSession, isApiAvailable]);

  useEffect(() => {
    if (isApiAvailable) {
      refreshSessions();
      
      const interval = setInterval(refreshSessions, 30000);
      return () => clearInterval(interval);
    }
  }, [isApiAvailable]);

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
