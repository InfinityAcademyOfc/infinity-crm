
import { useState, useEffect } from "react";

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

  useEffect(() => {
    if (!sessionId) return;

    let intervalId: NodeJS.Timeout;
    let firstTimeoutId: NodeJS.Timeout;

    const fetchQrCode = async () => {
      try {
        setLoading(true);

        if (!API_URL) {
          console.error("API URL is not defined");
          setStatus("error");
          setLoading(false);
          return;
        }

        const statusRes = await fetch(`${API_URL}/sessions/${sessionId}/status`);
        if (!statusRes.ok)
          throw new Error(`Failed to fetch status: ${statusRes.status}`);

        const statusData = await statusRes.json();
        console.log("WhatsApp connection status:", statusData.status);

        setStatus(statusData.status as WhatsAppConnectionStatus);

        if (statusData.status === "qr") {
          const qrRes = await fetch(`${API_URL}/sessions/${sessionId}/qrcode`);
          if (!qrRes.ok)
            throw new Error(`Failed to fetch QR code: ${qrRes.status}`);

          const qrData = await qrRes.json();
          console.log("QR Code response:", qrData);
          setQrCodeData(qrData.qr || qrData.qrCode || qrData.code || null);
        } else {
          setQrCodeData(null);
        }
      } catch (error) {
        console.error("Erro ao buscar status/QR da sessão:", error);
        setStatus("error");
        setQrCodeData(null);
      } finally {
        setLoading(false);
      }
    };

    firstTimeoutId = setTimeout(() => {
      fetchQrCode();
      intervalId = setInterval(fetchQrCode, 10000);
    }, 2000);

    return () => {
      clearTimeout(firstTimeoutId);
      clearInterval(intervalId);
    };
  }, [sessionId]);

  return { loading, qrCodeData, status };
};
