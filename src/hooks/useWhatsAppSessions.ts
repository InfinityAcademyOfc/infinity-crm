
import { useState, useEffect } from "react";
import { WhatsAppSession, WhatsAppConnectionStatus } from "@/types/whatsapp";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "";

export function useWhatsAppSessions() {
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [currentSession, setCurrentSession] = useState<string | null>(() => localStorage.getItem("wa-session-id") || null);
  const [connectionStatus, setConnectionStatus] = useState<WhatsAppConnectionStatus>("not_started");
  const { toast } = useToast();

  const refreshSessions = async () => {
    setLoadingSessions(true);
    try {
      const res = await fetch(`${API_URL}/sessions`);
      if (!res.ok) throw new Error(`Failed to fetch sessions: ${res.status}`);
      const data = await res.json();
      setSessions(data);
    } catch (error) {
      console.error("refreshSessions error:", error);
      // Removendo notificações de erro sobre sessões
    } finally {
      setLoadingSessions(false);
    }
  };

  const fetchConnectionStatus = async (sessionId: string) => {
    try {
      const res = await fetch(`${API_URL}/sessions/${sessionId}/status`);
      if (!res.ok) throw new Error(`Status fetch error: ${res.status}`);
      const data = await res.json();
      setConnectionStatus(data.status || "error");
    } catch (error) {
      console.error("fetchConnectionStatus error:", error);
      setConnectionStatus("error");
    }
  };

  const connectSession = async (sessionId: string) => {
    try {
      await fetch(`${API_URL}/sessions/${sessionId}/start`, { method: "POST" });
      setCurrentSession(sessionId);
      localStorage.setItem("wa-session-id", sessionId);
      await fetchConnectionStatus(sessionId);
    } catch (error) {
      console.error("connectSession error:", error);
      toast({
        title: "Erro",
        description: "Não foi possível conectar à sessão do WhatsApp",
        variant: "destructive",
      });
    }
  };

  const disconnectSession = async (sessionId: string) => {
    try {
      await fetch(`${API_URL}/sessions/${sessionId}/logout`, { method: "POST" });
      setConnectionStatus("not_started");
      // Removemos notificações sobre sessão
      await refreshSessions();
    } catch (error) {
      console.error("disconnectSession error:", error);
      // Removemos notificações de erro sobre sessões
    }
  };

  const createNewSession = () => {
    const newSessionId = `session_${Date.now()}`;
    setCurrentSession(newSessionId);
    localStorage.setItem("wa-session-id", newSessionId);
    setConnectionStatus("not_started");
    return newSessionId;
  };

  // Atualizar status de conexão periodicamente
  useEffect(() => {
    if (!currentSession) return;
    
    fetchConnectionStatus(currentSession);
    
    const interval = setInterval(() => fetchConnectionStatus(currentSession), 10000);
    
    return () => clearInterval(interval);
  }, [currentSession]);

  // Carregar sessões inicialmente
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
