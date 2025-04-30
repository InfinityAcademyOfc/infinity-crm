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

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/sessions`);
        const data = await res.json();
        setSessions(data);
      } catch (error) {
        console.error("Erro ao buscar sessões:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();

    const interval = setInterval(fetchSessions, 10000); // atualiza a cada 10s
    return () => clearInterval(interval);
  }, []);

  return { sessions, loading };
};
