
import { useEffect, useState } from "react";

interface Session {
  id: string;
  status: "CONNECTED" | "DISCONNECTED" | "QRCODE" | "ERROR";
  name?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "";

export const useSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!API_URL) {
          console.error("API URL is not defined");
          throw new Error("API URL is not configured");
        }

        const res = await fetch(`${API_URL}/sessions`);
        if (!res.ok) {
          throw new Error(`Failed to fetch sessions: ${res.status}`);
        }
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Response is not JSON:", contentType);
          throw new Error("Invalid server response format");
        }
        
        const data = await res.json();
        setSessions(data);
      } catch (error) {
        console.error("Erro ao buscar sessões:", error);
        setError(error instanceof Error ? error : new Error("Unknown error"));
        setSessions([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();

    const interval = setInterval(fetchSessions, 10000); // atualiza a cada 10s
    return () => clearInterval(interval);
  }, []);

  return { sessions, loading, error };
};
