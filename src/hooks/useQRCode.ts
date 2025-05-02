
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useQRCode = (sessionId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [pollingTimer, setPollingTimer] = useState<NodeJS.Timeout | null>(null);

  // Function to fetch QR code
  const fetchQrCode = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real implementation, this would call an API to get the QR code
      // For this demo, we're just generating a mock QR code
      const mockResponse = {
        qrcode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=whatsapp-connect-${sessionId}-${Date.now()}`,
        status: "PENDING"
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setQrCodeData(mockResponse.qrcode);
      
      return mockResponse;
    } catch (err: any) {
      console.error("Error fetching QR code:", err);
      setError(err instanceof Error ? err : new Error(err?.message || "Unknown error"));
      toast.error("Erro ao carregar QR code");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh QR code
  const refetch = () => {
    if (pollingTimer) {
      clearTimeout(pollingTimer);
      setPollingTimer(null);
    }
    return fetchQrCode();
  };

  useEffect(() => {
    if (!sessionId) return;
    
    // Start fetching the QR code
    fetchQrCode();
    
    // Set up a polling mechanism to refresh the QR code every 30 seconds
    const timer = setInterval(() => {
      fetchQrCode();
    }, 30000);
    
    setPollingTimer(timer);
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [sessionId]);

  return { loading, qrCodeData, error, refetch };
};

export default useQRCode;
