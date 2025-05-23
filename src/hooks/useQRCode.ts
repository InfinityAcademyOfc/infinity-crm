
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
  const attemptRef = useRef<number>(0);

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

    const fetchQrCode = async () => {
      try {
        // Primeiro verificamos o status da sessão
        const statusRes = await fetch(`${API_URL}/sessions/${sessionId}/status`, {
          signal: AbortSignal.timeout(8000) // Timeout aumentado
        });
        
        if (!statusRes.ok) {
          if (mountedRef.current) {
            // Em caso de erro de status, ainda tentamos obter o QR Code
            console.log(`Status indisponível, tentando QR code diretamente`);
          }
        } else {
          const statusData = await statusRes.json();
          
          if (!mountedRef.current) return;
          
          const newStatus = statusData.status as WhatsAppConnectionStatus;
          setStatus(newStatus);
          
          // Se conectado, podemos limpar o QR code
          if (newStatus === "connected") {
            setQrCodeData(null);
            setLoading(false);
            attemptRef.current = 0;
            return;
          }
        }

        // Sempre tentamos obter o QR code se não estiver conectado
        // De acordo com o backend, o endpoint de QR code inicia a sessão se necessário
        const qrRes = await fetch(`${API_URL}/sessions/${sessionId}/qr`, {
          signal: AbortSignal.timeout(8000)
        });
        
        if (!mountedRef.current) return;
        
        if (!qrRes.ok) {
          // Se o QR não estiver pronto, não consideramos um erro, apenas esperamos
          if (qrRes.status === 202) {
            console.log("QR Code ainda não disponível, aguarde...");
            setStatus("loading");
            return;
          }
          
          console.warn(`Erro ao buscar QR code: ${qrRes.status}`);
          attemptRef.current += 1;
          return;
        }
        
        const qrData = await qrRes.json();
        
        if (qrData && qrData.qr) {
          setQrCodeData(qrData.qr);
          setStatus("qr");
          setError(null);
          attemptRef.current = 0;
        }
      } catch (error) {
        if (mountedRef.current) {
          console.error("Erro ao conectar com API:", error);
          
          // Incrementamos a contagem de tentativas
          attemptRef.current += 1;
          
          // Apenas consideramos erro após várias tentativas
          if (attemptRef.current > 3) {
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
    
    // Intervalos mais curtos no início para obter o QR rapidamente
    const interval = window.setInterval(fetchQrCode, 5000);
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
