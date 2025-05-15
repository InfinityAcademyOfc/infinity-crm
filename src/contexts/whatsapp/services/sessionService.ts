
import { WhatsAppSession } from "../types";
import { WhatsAppConnectionStatus } from "@/hooks/useQRCode";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "";

export const fetchSessions = async (): Promise<WhatsAppSession[]> => {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const res = await fetch(`${API_URL}/sessions`);
  if (!res.ok) {
    throw new Error(`Failed to fetch sessions: ${res.status}`);
  }
    
  return await res.json();
};

export const fetchConnectionStatus = async (sessionId: string): Promise<WhatsAppConnectionStatus> => {
  if (!sessionId || !API_URL) {
    return "not_started";
  }
  
  try {
    const res = await fetch(`${API_URL}/sessions/${sessionId}/status`);
    if (!res.ok) throw new Error(`Failed to fetch status: ${res.status}`);
    
    const data = await res.json();
    return data.status as WhatsAppConnectionStatus;
  } catch (error) {
    console.error("Error fetching connection status:", error);
    return "error";
  }
};

export const connectWhatsAppSession = async (sessionId: string): Promise<void> => {
  if (!API_URL) return;
  
  await fetch(`${API_URL}/sessions/${sessionId}/start`, { method: "POST" });
};

export const disconnectWhatsAppSession = async (sessionId: string): Promise<void> => {
  if (!API_URL) return;
  
  await fetch(`${API_URL}/sessions/${sessionId}/logout`, { method: "POST" });
};

export const sendWhatsAppMessage = async (
  sessionId: string,
  number: string,
  message: string
): Promise<void> => {
  if (!API_URL) return;
  
  await fetch(`${API_URL}/messages/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, number, message })
  });
};
