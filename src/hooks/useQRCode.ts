
import { useEffect, useRef, useState } from "react";
import { WhatsAppConnectionStatus } from "@/types/whatsapp";

const API_URL = import.meta.env.VITE_API_URL || "";

export interface QRCodeHookResult {
  qrCodeData: string | null;
  status: WhatsAppConnectionStatus;
  loading: boolean;
  error: string | null;
}

export function useQRCode(sessionId: string): QRCodeHookResult {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [status, setStatus] = useState<WhatsAppConnectionStatus>("not_started");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<number | null>(null);
  const mountedRef = useRef<boolean>(true);
  const lastStatusRef = useRef<WhatsAppConnectionStatus>("not_started");
  const attemptRef = useRef<number>(0);

  useEffect(() => {
    mountedRef.current = true;
    attemptRef.current = 0;

    if (!API_URL || !sessionId) {
      setStatus("error");
      setQrCodeData(null);
      setLoading(false);
      setError("API URL ou ID da sessão não definidos");
      return;
    }

    const fetchQrCode = async () => {
      try {
        const res = await fetch(`${API_URL}/sessions/${sessionId}/status`);
        
        if (!res.ok) {
          if (mountedRef.current) {
            setStatus("error");
            setQrCodeData(null);
            setError(`Erro ao buscar status: ${res.status}`);
            attemptRef.current += 1;
          }
          return;
        }

        const data = await res.json();

        if (!mountedRef.current) return;

        const newStatus = data.status as WhatsAppConnectionStatus;
        setError(null);

        // Always update the status
        setStatus(newStatus);
        
        // Update QR code if it's available or clear it when not needed
        if (newStatus === "qr" && data.qr_code) {
          setQrCodeData(data.qr_code);
        } else if (newStatus === "connected") {
          setQrCodeData(null);
          clearInterval(intervalRef.current!);
        }

        // Track status changes
        lastStatusRef.current = newStatus;
        
        // Reset attempt counter on successful response
        attemptRef.current = 0;
      } catch (error) {
        if (mountedRef.current) {
          console.error("Erro ao buscar QR code:", error);
          setError("Erro ao buscar código QR. Tente novamente.");
          attemptRef.current += 1;
          
          // If we've had too many errors in a row, consider the connection failed
          if (attemptRef.current > 5) {
            setStatus("error");
          }
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    fetchQrCode();
    
    // Fetch more frequently at first, then slow down
    const interval = window.setInterval(fetchQrCode, 4000);
    intervalRef.current = interval;

    return () => {
      mountedRef.current = false;
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sessionId]);

  return { qrCodeData, status, loading, error };
}

export type { WhatsAppConnectionStatus } from "@/types/whatsapp";
