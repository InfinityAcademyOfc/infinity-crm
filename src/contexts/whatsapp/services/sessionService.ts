
import { WhatsAppSession } from "../types";
import { WhatsAppConnectionStatus } from "@/hooks/useQRCode";

const API_URL = import.meta.env.VITE_API_URL || "";

// Circuit breaker storage key
const API_CIRCUIT_BREAKER_KEY = "wa-api-circuit-breaker";
const MAX_RETRY_ATTEMPTS = 3;
const CIRCUIT_BREAKER_TIMEOUT = 5 * 60 * 1000; // 5 minutes

// Check if circuit breaker is active
const isCircuitBreakerActive = (): boolean => {
  try {
    const circuitBreakerData = localStorage.getItem(API_CIRCUIT_BREAKER_KEY);
    if (!circuitBreakerData) return false;
    
    const { timestamp, failures } = JSON.parse(circuitBreakerData);
    
    // Reset if timeout has passed
    if (Date.now() - timestamp > CIRCUIT_BREAKER_TIMEOUT) {
      localStorage.removeItem(API_CIRCUIT_BREAKER_KEY);
      return false;
    }
    
    return failures >= MAX_RETRY_ATTEMPTS;
  } catch (e) {
    // If any error occurs reading localStorage, reset
    localStorage.removeItem(API_CIRCUIT_BREAKER_KEY);
    return false;
  }
};

// Record API failure
const recordFailure = (): void => {
  try {
    const circuitBreakerData = localStorage.getItem(API_CIRCUIT_BREAKER_KEY);
    const data = circuitBreakerData 
      ? JSON.parse(circuitBreakerData) 
      : { failures: 0, timestamp: Date.now() };
    
    data.failures += 1;
    localStorage.setItem(API_CIRCUIT_BREAKER_KEY, JSON.stringify(data));
  } catch (e) {
    // Fallback if localStorage fails
    console.error("Failed to record API failure:", e);
  }
};

// Reset circuit breaker
export const resetCircuitBreaker = (): void => {
  localStorage.removeItem(API_CIRCUIT_BREAKER_KEY);
};

// Validate if API is functioning
export const validateApiConnection = async (): Promise<boolean> => {
  if (!API_URL || isCircuitBreakerActive()) return false;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_URL}/health`, { 
      method: 'GET',
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    recordFailure();
    return false;
  }
};

export const fetchSessions = async (): Promise<WhatsAppSession[]> => {
  if (!API_URL) {
    console.error("API URL is not configured");
    return [];
  }
  
  if (isCircuitBreakerActive()) {
    console.log("Circuit breaker active, skipping API call");
    throw new Error("API server unavailable. Please try again later.");
  }

  try {
    const res = await fetch(`${API_URL}/sessions`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) {
      recordFailure();
      throw new Error(`Failed to fetch sessions: ${res.status}`);
    }
      
    return await res.json();
  } catch (error) {
    recordFailure();
    console.error("Error fetching sessions:", error);
    throw error; // Re-throw to allow caller to handle
  }
};

export const fetchConnectionStatus = async (sessionId: string): Promise<WhatsAppConnectionStatus> => {
  if (!sessionId || !API_URL || isCircuitBreakerActive()) {
    return "not_started";
  }
  
  try {
    const res = await fetch(`${API_URL}/sessions/${sessionId}/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) {
      recordFailure();
      throw new Error(`Failed to fetch status: ${res.status}`);
    }
    
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
  
  if (isCircuitBreakerActive()) {
    throw new Error("API server unavailable. Please try again later.");
  }
  
  try {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/start`, { 
      method: "POST",
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      recordFailure();
      throw new Error(`Failed to connect session: ${response.status}`);
    }
  } catch (error) {
    recordFailure();
    console.error("Error connecting WhatsApp session:", error);
    throw error;
  }
};

export const disconnectWhatsAppSession = async (sessionId: string): Promise<void> => {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }
  
  if (isCircuitBreakerActive()) {
    throw new Error("API server unavailable. Please try again later.");
  }
  
  try {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/logout`, { 
      method: "POST",
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      recordFailure();
      throw new Error(`Failed to disconnect session: ${response.status}`);
    }
  } catch (error) {
    recordFailure();
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
  
  if (isCircuitBreakerActive()) {
    throw new Error("API server unavailable. Please try again later.");
  }
  
  try {
    const response = await fetch(`${API_URL}/messages/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, number, message })
    });
    
    if (!response.ok) {
      recordFailure();
      throw new Error(`Failed to send message: ${response.status}`);
    }
  } catch (error) {
    recordFailure();
    console.error("Error sending WhatsApp message:", error);
    throw error;
  }
};
