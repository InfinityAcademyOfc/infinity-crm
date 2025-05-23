
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
  isApiAvailable: boolean;
}

export function useWhatsAppSessions(): WhatsAppSessionsHookResult {
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [currentSession, setCurrentSession] = useState<string | null>(
    () => localStorage.getItem("wa-session-id") || null
  );
  const [connectionStatus, setConnectionStatus] = useState<WhatsAppConnectionStatus>("not_started");
  const [isApiAvailable, setIsApiAvailable] = useState<boolean>(true);
  const { toast } = useToast();
  
  const refreshSessions = useCallback(async () => {
    if (!API_URL) {
      setLoadingSessions(false);
      setSessions([]);
      setIsApiAvailable(false);
      return;
    }
    
    setLoadingSessions(true);
    try {
      const res = await fetch(`${API_URL}/sessions`, {
        signal: AbortSignal.timeout(8000)
      });
      
      if (!res.ok) {
        console.warn(`Não foi possível obter as sessões: ${res.status}`);
        
        // Se o endpoint /sessions não estiver disponível, considere a API indisponível
        if (res.status === 404) {
          setIsApiAvailable(false);
          // Use sessões simuladas para uma experiência offline
          const mockSessions: WhatsAppSession[] = currentSession ? [
            {
              id: currentSession,
              name: "Meu WhatsApp",
              status: "not_started"
            }
          ] : [];
          setSessions(mockSessions);
        } else {
          setSessions([]);
        }
        return;
      }
      
      const data = await res.json();
      setSessions(data || []);
      setIsApiAvailable(true);
    } catch (error) {
      console.warn("Erro ao atualizar sessões:", error);
      setIsApiAvailable(false);
      
      // Não limpa as sessões existentes em caso de erro temporário
      // Fornecer dados simulados para uma melhor experiência
      if (sessions.length === 0 && currentSession) {
        setSessions([{
          id: currentSession,
          name: "Meu WhatsApp",
          status: "not_started"
        }]);
      }
    } finally {
      setLoadingSessions(false);
    }
  }, [API_URL, currentSession, sessions.length]);

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
        // Verificar se a API está totalmente indisponível
        if (res.status === 404) {
          setIsApiAvailable(false);
        }
        return;
      }
      
      setIsApiAvailable(true);
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
        // Se a API não estiver disponível, simule uma conexão local
        if (res.status === 404) {
          setIsApiAvailable(false);
          toast({ 
            title: "Modo offline",
            description: "Sistema funcionando em modo simulado"
          });
          setCurrentSession(sessionId);
          localStorage.setItem("wa-session-id", sessionId);
          return;
        }
        throw new Error("Erro ao conectar sessão");
      }
      
      setIsApiAvailable(true);
      setCurrentSession(sessionId);
      localStorage.setItem("wa-session-id", sessionId);
      await fetchConnectionStatus(sessionId);
    } catch (error) {
      console.warn("Erro ao conectar sessão:", error);
      
      // Em caso de erro, permitir o uso do modo simulado
      toast({
        title: "Erro na conexão",
        description: "Usando modo simulado temporariamente"
      });
      setCurrentSession(sessionId);
      localStorage.setItem("wa-session-id", sessionId);
    }
  }, [API_URL, fetchConnectionStatus, toast]);

  const disconnectSession = useCallback(async (sessionId: string) => {
    if (!API_URL || !sessionId) return;
    
    try {
      if (isApiAvailable) {
        const res = await fetch(`${API_URL}/sessions/${sessionId}/logout`, { method: "POST" });
        
        if (!res.ok) {
          console.warn(`Erro ao desconectar: ${res.status}`);
        }
      }
      
      setConnectionStatus("not_started");
      await refreshSessions();
    } catch (error) {
      console.warn("Erro ao desconectar sessão:", error);
    }
  }, [API_URL, refreshSessions, isApiAvailable]);

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
    createNewSession,
    isApiAvailable
  };
}
