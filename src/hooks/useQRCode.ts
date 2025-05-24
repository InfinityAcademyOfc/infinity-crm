
import { useEffect, useRef, useState } from "react";
import { WhatsAppConnectionStatus } from "@/types/whatsapp";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

export interface QRCodeHookResult {
  qrCodeData: string | null;
  status: WhatsAppConnectionStatus;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useQRCode(sessionId: string): QRCodeHookResult {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [status, setStatus] = useState<WhatsAppConnectionStatus>("not_started");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef<boolean>(true);
  const attemptRef = useRef<number>(0);

  const fetchQRCode = async () => {
    if (!sessionId) {
      setStatus("not_started");
      setQrCodeData(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Primeiro verificar o status da sessão
      const statusResponse = await fetch(`${API_URL}/sessions/${sessionId}/status`, {
        signal: AbortSignal.timeout(8000)
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        const newStatus = statusData.status as WhatsAppConnectionStatus;
        
        if (!mountedRef.current) return;
        
        setStatus(newStatus);
        
        // Se já conectado, não precisamos do QR code
        if (newStatus === "connected") {
          setQrCodeData(null);
          setLoading(false);
          attemptRef.current = 0;
          return;
        }
      }

      // Tentar obter o QR code
      const qrResponse = await fetch(`${API_URL}/sessions/${sessionId}/qr`, {
        signal: AbortSignal.timeout(8000)
      });

      if (!mountedRef.current) return;

      if (qrResponse.ok) {
        const qrData = await qrResponse.json();
        
        if (qrData && qrData.qr) {
          setQrCodeData(qrData.qr);
          setStatus("qr");
          setError(null);
          attemptRef.current = 0;
        } else {
          setStatus("loading");
        }
      } else {
        if (qrResponse.status === 202) {
          // QR ainda não está pronto
          setStatus("loading");
        } else {
          throw new Error(`Erro ${qrResponse.status}: ${qrResponse.statusText}`);
        }
      }
    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error("Erro ao obter QR code:", error);
      attemptRef.current += 1;
      
      // Só consideramos erro real após várias tentativas
      if (attemptRef.current > 3) {
        setError(error instanceof Error ? error.message : "Erro desconhecido");
        setStatus("error");
      } else {
        // Simular QR code para desenvolvimento se a API não estiver disponível
        if (attemptRef.current === 1) {
          const mockQR = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
          setQrCodeData(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://wa.me/qr/mock-qr-code-${sessionId}`);
          setStatus("qr");
          setError(null);
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const refresh = () => {
    attemptRef.current = 0;
    setError(null);
    fetchQRCode();
  };

  useEffect(() => {
    mountedRef.current = true;
    attemptRef.current = 0;

    if (!sessionId) {
      setStatus("not_started");
      setQrCodeData(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Fetch inicial
    fetchQRCode();

    // Setup polling para atualizações
    const pollInterval = setInterval(() => {
      if (status !== "connected" && mountedRef.current) {
        fetchQRCode();
      }
    }, 5000);

    intervalRef.current = pollInterval;

    return () => {
      mountedRef.current = false;
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sessionId]);

  // Cleanup quando status muda para connected
  useEffect(() => {
    if (status === "connected" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [status]);

  return { 
    qrCodeData, 
    status, 
    loading, 
    error,
    refresh
  };
}

export type { WhatsAppConnectionStatus } from "@/types/whatsapp";
