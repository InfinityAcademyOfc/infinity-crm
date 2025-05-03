
import { useEffect, useState } from "react";

interface Session {
  id: string;
  status: "CONNECTED" | "DISCONNECTED" | "QRCODE" | "ERROR";
  name?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        // Simular uma chamada de API
        setTimeout(() => {
          // Dados simulados
          const mockSessions: Session[] = [
            { id: "session-1", status: "CONNECTED", name: "Atendimento Principal" },
            { id: "session-2", status: "DISCONNECTED", name: "Suporte" },
          ];
          setSessions(mockSessions);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Erro ao buscar sessões:", err);
        setError(err instanceof Error ? err : new Error("Erro desconhecido"));
        setLoading(false);
      }
    };

    fetchSessions();

    const interval = setInterval(fetchSessions, 10000); // atualiza a cada 10s
    return () => clearInterval(interval);
  }, []);

  return { sessions, loading, error };
};
