
import { useEffect } from "react";
import QRCodeLoading from "@/components/whatsapp/ui/QRCodeLoading";
import QRCodeInstructions from "@/components/whatsapp/ui/QRCodeInstructions";
import QRCodeDisplay from "@/components/whatsapp/ui/QRCodeDisplay";
import { useQRCode } from "@/hooks/useQRCode";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "";

interface QRCodeScannerProps {
  sessionId: string;
  onLogin?: () => void;
}

const QRCodeScanner = ({ sessionId, onLogin }: QRCodeScannerProps) => {
  const { loading, qrCodeData, status } = useQRCode(sessionId);
  const { toast } = useToast();

  // Start session automatically when mounted
  useEffect(() => {
    const start = async () => {
      try {
        const response = await fetch(`${API_URL}/sessions/${sessionId}/start`, {
          method: "POST",
        });

        if (!response.ok) {
          console.error(`Error starting session: ${response.status}`);
        }
      } catch (error) {
        console.error("Error starting session:", error);
      }
    };

    if (sessionId) start();
  }, [sessionId]);

  // Trigger login callback when connected
  useEffect(() => {
    if (status === "connected" && onLogin) {
      // Notify with toast
      toast({
        title: "WhatsApp Connected",
        description: "Your device has been successfully connected to WhatsApp.",
        variant: "default",
      });
      // Call the callback
      onLogin();
    }
  }, [status, onLogin, toast]);

  // Debug logging
  useEffect(() => {
    console.log("QR Code Scanner state:", { loading, status, qrCodeData: qrCodeData ? "Available" : "Not available" });
  }, [loading, status, qrCodeData]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {loading ? (
        <QRCodeLoading />
      ) : status === "qr" && qrCodeData ? (
        <>
          <QRCodeInstructions />
          <QRCodeDisplay qrCodeData={qrCodeData} />
          <p className="text-sm text-center text-muted-foreground mt-4">
            The QR code will automatically update every 15 seconds.
          </p>
        </>
      ) : status === "connected" ? (
        <p className="text-center text-green-600 font-medium mt-4">
          Device successfully connected!
        </p>
      ) : status === "error" ? (
        <p className="text-center text-red-500 font-medium mt-4">
          An error occurred while loading the QR Code.
        </p>
      ) : (
        <p className="text-center text-muted-foreground mt-4">
          Waiting for session to start...
        </p>
      )}
    </div>
  );
};

export default QRCodeScanner;
