
import { useState, useEffect, useCallback } from "react";
import { WhatsAppSession, WhatsAppConnectionStatus } from "@/types/whatsapp";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

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
  const [retryCount, setRetryCount] = useState(0);
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
      // Tenta buscar sessões do banco de dados local primeiro
      const { data: localSessions, error: localError } = await supabase
        .from("whatsapp_sessions")
        .select("*")
        .order("created_at", { ascending: false });
      
      // Se houver sessões locais, usamos essas enquanto tentamos sincronizar com a API
      if (localSessions && localSessions.length > 0) {
        const formattedSessions = localSessions.map(s => ({
          id: s.session_id,
          name: s.name || `Sessão ${s.session_id.substring(0, 8)}`,
          status: s.status
        }));
        setSessions(formattedSessions);
      }
      
      // Agora tenta buscar da API do WhatsApp
      const res = await fetch(`${API_URL}/sessions`, {
        signal: AbortSignal.timeout(8000),
        cache: 'no-store'
      });
      
      if (!res.ok) {
        console.warn(`Não foi possível obter as sessões: ${res.status}`);
        
        // Se o endpoint /sessions não estiver disponível, considere a API indisponível
        if (res.status === 404) {
          setIsApiAvailable(false);
          // Use sessões locais para uma experiência offline
          if (localSessions && localSessions.length > 0) {
            // Já carregamos acima, não precisamos fazer nada
          } else if (currentSession) {
            // Fallback para sessão atual caso não tenhamos sessões locais
            const mockSessions: WhatsAppSession[] = [
              {
                id: currentSession,
                name: "Meu WhatsApp",
                status: "not_started"
              }
            ];
            setSessions(mockSessions);
          }
        }
        return;
      }
      
      const data = await res.json();
      setSessions(data || []);
      setIsApiAvailable(true);
      
      // Sincronizar as sessões da API com o banco de dados local
      if (data && data.length > 0) {
        for (const session of data) {
          await supabase
            .from("whatsapp_sessions")
            .upsert({
              session_id: session.id,
              name: session.name,
              status: session.status,
              is_connected: session.status === "connected",
              updated_at: new Date().toISOString()
            })
            .eq("session_id", session.id);
        }
      }
    } catch (error) {
      console.warn("Erro ao atualizar sessões:", error);
      setIsApiAvailable(false);
      
      // Não limpa as sessões existentes em caso de erro temporário
      // Se temos sessões do banco local, já carregamos acima
      if (sessions.length === 0 && currentSession) {
        setSessions([{
          id: currentSession,
          name: "Meu WhatsApp",
          status: "not_started"
        }]);
      }
      
      // Implementar retry logic
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          refreshSessions();
        }, 3000); // Tenta novamente após 3 segundos
      }
    } finally {
      setLoadingSessions(false);
      setRetryCount(0); // Reset retry count on success
    }
  }, [API_URL, currentSession, sessions.length, retryCount]);

  const fetchConnectionStatus = useCallback(async (sessionId: string) => {
    if (!API_URL || !sessionId) {
      setConnectionStatus("not_started");
      return;
    }
    
    try {
      // Tenta buscar status do banco de dados local primeiro
      const { data: localSession } = await supabase
        .from("whatsapp_sessions")
        .select("status")
        .eq("session_id", sessionId)
        .single();
        
      if (localSession) {
        setConnectionStatus(localSession.status as WhatsAppConnectionStatus);
      }
      
      // Agora tenta buscar da API
      const res = await fetch(`${API_URL}/sessions/${sessionId}/status`, {
        signal: AbortSignal.timeout(8000),
        cache: 'no-store'
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
      const status = data?.status as WhatsAppConnectionStatus || "not_started";
      setConnectionStatus(status);
      
      // Atualiza o status no banco local
      await supabase
        .from("whatsapp_sessions")
        .upsert({
          session_id: sessionId,
          status,
          is_connected: status === "connected",
          updated_at: new Date().toISOString()
        })
        .eq("session_id", sessionId);
    } catch (error) {
      console.warn("Erro ao obter status da sessão:", error);
      // Não alteramos o status em caso de erro de rede temporário
    }
  }, [API_URL]);

  const connectSession = useCallback(async (sessionId: string) => {
    if (!API_URL || !sessionId) return;
    
    try {
      setConnectionStatus("loading");
      
      // O endpoint de QR já inicia a sessão
      const res = await fetch(`${API_URL}/sessions/${sessionId}/qr`, { 
        method: "GET",
        signal: AbortSignal.timeout(10000),
        cache: 'no-store'
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
          
          // Salva no banco local
          await supabase
            .from("whatsapp_sessions")
            .upsert({
              session_id: sessionId,
              name: `Sessão ${sessionId.substring(0, 8)}`,
              status: "not_started",
              updated_at: new Date().toISOString()
            })
            .eq("session_id", sessionId);
            
          return;
        }
        throw new Error("Erro ao conectar sessão");
      }
      
      setIsApiAvailable(true);
      setCurrentSession(sessionId);
      localStorage.setItem("wa-session-id", sessionId);
      
      // Salva no banco local
      await supabase
        .from("whatsapp_sessions")
        .upsert({
          session_id: sessionId,
          name: `Sessão ${sessionId.substring(0, 8)}`,
          status: "qr", // Começa com status QR
          updated_at: new Date().toISOString()
        })
        .eq("session_id", sessionId);
        
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
      
      // Salva no banco local como erro
      await supabase
        .from("whatsapp_sessions")
        .upsert({
          session_id: sessionId,
          name: `Sessão ${sessionId.substring(0, 8)}`,
          status: "error",
          updated_at: new Date().toISOString()
        })
        .eq("session_id", sessionId);
    }
  }, [API_URL, fetchConnectionStatus, toast]);

  const disconnectSession = useCallback(async (sessionId: string) => {
    if (!sessionId) return;
    
    try {
      if (isApiAvailable && API_URL) {
        const res = await fetch(`${API_URL}/sessions/${sessionId}/logout`, { 
          method: "POST",
          cache: 'no-store'
        });
        
        if (!res.ok) {
          console.warn(`Erro ao desconectar: ${res.status}`);
        }
      }
      
      setConnectionStatus("not_started");
      
      // Atualiza status no banco local
      await supabase
        .from("whatsapp_sessions")
        .upsert({
          session_id: sessionId,
          status: "not_started",
          is_connected: false,
          updated_at: new Date().toISOString()
        })
        .eq("session_id", sessionId);
        
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
    
    // Criar a sessão no banco local
    supabase
      .from("whatsapp_sessions")
      .insert({
        session_id: newSessionId,
        name: `Sessão ${newSessionId.substring(0, 8)}`,
        status: "not_started",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .then(() => {
        refreshSessions();
      });
      
    return newSessionId;
  }, [refreshSessions]);

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
