
import { useEffect, useRef, useState } from "react";
import { WhatsAppConnectionStatus } from "@/types/whatsapp";

const API_URL = import.meta.env.VITE_API_URL || "";

export interface QRCodeHookResult {
  qrCodeData: string | null;
  status: WhatsAppConnectionStatus;
  loading: boolean;
}

export function useQRCode(sessionId: string): QRCodeHookResult {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [status, setStatus] = useState<WhatsAppConnectionStatus>("not_started");
  const [loading, setLoading] = useState<boolean>(true);
  const intervalRef = useRef<number | null>(null);
  const mountedRef = useRef<boolean>(true);

  useEffect(() => {
    mountedRef.current = true;

    if (!API_URL || !sessionId) {
      setStatus("error");
      setQrCodeData(null);
      setLoading(false);
      return;
    }

    const fetchQrCode = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/sessions/${sessionId}/status`);
        const data = await res.json();

        if (!mountedRef.current) return;

        if (data.status === "connected") {
          clearInterval(intervalRef.current!);
          setStatus("connected");
          setQrCodeData(null);
        } else if (data.status === "qr") {
          setStatus("qr");
          setQrCodeData(data.qr_code || null);
        } else if (data.status === "not_started") {
          setStatus("not_started");
          setQrCodeData(null);
        } else {
          setStatus("error");
          setQrCodeData(null);
        }
      } catch (err) {
        if (mountedRef.current) {
          setStatus("error");
          setQrCodeData(null);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchQrCode();
    intervalRef.current = window.setInterval(fetchQrCode, 4000);

    return () => {
      mountedRef.current = false;
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sessionId]);

  return { qrCodeData, status, loading };
}

// Re-export the type for easier access
export type { WhatsAppConnectionStatus } from "@/types/whatsapp";
