
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export const useQRCode = (sessionId: string) => {
  const [loading, setLoading] = useState(true);
  const [qrCodeData, setQrCodeData] = useState("");
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!sessionId) {
      console.error("Nenhum sessionId fornecido para useQRCode");
      setLoading(false);
      return;
    }

    const fetchQrCode = async () => {
      try {
        setLoading(true);
        // Simulamos uma chamada à API
        setTimeout(() => {
          // Geramos um QR Code fictício para demonstração
          const mockQrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=WhatsAppDemo-${sessionId}-${Date.now()}`;
          setQrCodeData(mockQrCode);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Erro ao buscar QR code:", error);
        setError(error instanceof Error ? error : new Error("Erro desconhecido"));
        setLoading(false);
      }
    };

    fetchQrCode();

    const interval = setInterval(fetchQrCode, 30000); // atualiza a cada 30s
    return () => clearInterval(interval);
  }, [sessionId]);

  return { loading, qrCodeData, error };
};
