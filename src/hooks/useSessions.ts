
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
  const [error, setError] = useState<Error | null>(null); // Added error state

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state
        const res = await fetch(`${API_URL}/sessions`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setSessions(data);
      } catch (err) {
        console.error("Erro ao buscar sessões:", err);
        setError(err instanceof Error ? err : new Error("Unknown error occurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();

    const interval = setInterval(fetchSessions, 10000); // atualiza a cada 10s
    return () => clearInterval(interval);
  }, []);

  return { sessions, loading, error }; // Return error state
};
