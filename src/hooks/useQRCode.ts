
import { useState, useEffect, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";

export type WhatsAppConnectionStatus =
  | "not_started"
  | "qr"
  | "connected"
  | "disconnected"
  | "error";

export const useQRCode = (sessionId: string) => {
  const [loading, setLoading] = useState(true);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [status, setStatus] = useState<WhatsAppConnectionStatus>("not_started");
  const fetchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (fetchTimerRef.current) {
        clearInterval(fetchTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    const fetchQrCode = async () => {
      if (!API_URL || !sessionId) {
        setStatus("error");
        setQrCodeData(null);
        setLoading(false);
        return;
      }

      if (!mountedRef.current) return;
      
      try {
        setLoading(true);

        if (!API_URL) {
          console.error("API URL is not defined");
          setStatus("error");
          setLoading(false);
          return;
        }

        const statusRes = await fetch(`${API_URL}/sessions/${sessionId}/status`);
        if (!statusRes.ok) {
          throw new Error(`Failed to fetch status: ${statusRes.status}`);
        }

        const statusData = await statusRes.json();
        console.log("WhatsApp connection status:", statusData.status);

        if (!mountedRef.current) return;
        setStatus(statusData.status as WhatsAppConnectionStatus);

        if (statusData.status === "qr") {
          const qrRes = await fetch(`${API_URL}/sessions/${sessionId}/qrcode`);
          if (!qrRes.ok) {
            throw new Error(`Failed to fetch QR code: ${qrRes.status}`);
          }

          const qrData = await qrRes.json();
          if (!mountedRef.current) return;
          
          const qrCodeString = qrData.qr || qrData.qrCode || qrData.code || null;
          setQrCodeData(qrCodeString);
        } else {
          if (!mountedRef.current) return;
          setQrCodeData(null);
        }
      } catch (error) {
        console.error("Error fetching status/QR code:", error);
        if (!mountedRef.current) return;
        setStatus("error");
        setQrCodeData(null);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    // Initial fetch with delay to avoid race conditions
    const initialTimeout = setTimeout(() => {
      fetchQrCode();
      
      // Then set up interval for updates
      if (fetchTimerRef.current) {
        clearInterval(fetchTimerRef.current);
      }
      
      fetchTimerRef.current = setInterval(fetchQrCode, 10000);
    }, 1000);

    return () => {
      clearTimeout(initialTimeout);
      if (fetchTimerRef.current) {
        clearInterval(fetchTimerRef.current);
      }
    };
  }, [sessionId]);

  return { loading, qrCodeData, status };
};
