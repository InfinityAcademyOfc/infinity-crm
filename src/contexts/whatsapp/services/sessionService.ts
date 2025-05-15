
import { WhatsAppSession } from "../types";
import { WhatsAppConnectionStatus } from "@/hooks/useQRCode";

const API_URL = import.meta.env.VITE_API_URL || "";

export const fetchSessions = async (): Promise<WhatsAppSession[]> => {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  try {
    const res = await fetch(`${API_URL}/sessions`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch sessions: ${res.status}`);
    }
      
    return await res.json();
  } catch (error) {
    console.error("Error fetching sessions:", error);
    throw error; // Re-throw to allow caller to handle
  }
};

export const fetchConnectionStatus = async (sessionId: string): Promise<WhatsAppConnectionStatus> => {
  if (!sessionId || !API_URL) {
    return "not_started";
  }
  
  try {
    const res = await fetch(`${API_URL}/sessions/${sessionId}/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) throw new Error(`Failed to fetch status: ${res.status}`);
    
    const data = await res.json();
    return data.status as WhatsAppConnectionStatus;
  } catch (error) {
    console.error("Error fetching connection status:", error);
    return "error";
  }
};

export const connectWhatsAppSession = async (sessionId: string): Promise<void> => {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }
  
  try {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/start`, { 
      method: "POST",
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to connect session: ${response.status}`);
    }
  } catch (error) {
    console.error("Error connecting WhatsApp session:", error);
    throw error;
  }
};

export const disconnectWhatsAppSession = async (sessionId: string): Promise<void> => {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }
  
  try {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/logout`, { 
      method: "POST",
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to disconnect session: ${response.status}`);
    }
  } catch (error) {
    console.error("Error disconnecting WhatsApp session:", error);
    throw error;
  }
};

export const sendWhatsAppMessage = async (
  sessionId: string,
  number: string,
  message: string
): Promise<void> => {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }
  
  try {
    const response = await fetch(`${API_URL}/messages/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, number, message })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.status}`);
    }
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    throw error;
  }
};
