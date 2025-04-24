
import { useState, useEffect } from "react";

export const useQRCode = () => {
  const [loading, setLoading] = useState(true);
  const [qrCodeData, setQrCodeData] = useState("");

  useEffect(() => {
    // Simulates fetching a WhatsApp Web-like QR Code
    const fetchQrCode = async () => {
      try {
        setLoading(true);
        
        // This would be replaced with a real WhatsApp API integration
        // In a production environment, you would use the official WhatsApp Business API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate a QR code that points to the official WhatsApp Web URL
        const whatsappWebQRCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://web.whatsapp.com/&bgcolor=ffffff&color=4fce5d";
        
        setQrCodeData(whatsappWebQRCodeUrl);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar QR code:", error);
        setLoading(false);
      }
    };

    fetchQrCode();

    // Periodically refresh the QR code as real WhatsApp Web does
    const interval = setInterval(fetchQrCode, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  return { loading, qrCodeData };
};
