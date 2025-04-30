import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export const useQRCode = (sessionId: string) => {
  const [loading, setLoading] = useState(true);
  const [qrCodeData, setQrCodeData] = useState("");

  useEffect(() => {
    if (!sessionId) return;

    const fetchQrCode = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/sessions/${sessionId}/qrcode`);
        const data = await res.json();
        setQrCodeData(data.qrCode); // depende do seu backend retornar isso
      } catch (error) {
        console.error("Erro ao buscar QR code:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQrCode();

    const interval = setInterval(fetchQrCode, 30000); // atualiza a cada 30s
    return () => clearInterval(interval);
  }, [sessionId]);

  return { loading, qrCodeData };
};
