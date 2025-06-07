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

  const refreshSessions = async () => {
    setLoadingSessions(true);
    try {
      const res = await fetch(`${API_URL}/sessions`);
      if (!res.ok) throw new Error(`Erro ao buscar sessões: ${res.status}`);
      const data = await res.json();
      setSessions(data);
    } catch (error) {
      console.error("Erro ao atualizar sessões:", error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const fetchConnectionStatus = async (sessionId: string) => {
    try {
      const res = await fetch(`${API_URL}/sessions/${sessionId}/status`);
      if (!res.ok) throw new Error(`Erro ao buscar status: ${res.status}`);
      const data = await res.json();
      setConnectionStatus(data.status || "error");
    } catch (error) {
      console.error("Erro ao obter status da sessão:", error);
      setConnectionStatus("error");
    }
  };

  const connectSession = async (sessionId: string) => {
    try {
      const res = await fetch(`${API_URL}/sessions/${sessionId}/start`, { method: "POST" });
      if (!res.ok) throw new Error("Erro ao conectar sessão");
      setCurrentSession(sessionId);
      localStorage.setItem("wa-session-id", sessionId);
      await fetchConnectionStatus(sessionId);
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
    try {
      const res = await fetch(`${API_URL}/sessions/${sessionId}/logout`, { method: "POST" });
      if (!res.ok) throw new Error("Erro ao desconectar sessão");
      setConnectionStatus("not_started");
      await refreshSessions();
    } catch (error) {
      console.error("Erro ao desconectar sessão:", error);
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
    if (!currentSession) return;

    fetchConnectionStatus(currentSession);

    const interval = setInterval(() => fetchConnectionStatus(currentSession), 10000);
    return () => clearInterval(interval);
  }, [currentSession]);

  useEffect(() => {
    refreshSessions();

    const interval = setInterval(refreshSessions, 30000);
    return () => clearInterval(interval);
  }, []);

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
