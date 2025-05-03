
import QRCodeLoading from "./ui/QRCodeLoading";
import QRCodeInstructions from "./ui/QRCodeInstructions";
import QRCodeDisplay from "./ui/QRCodeDisplay";
import { useQRCode } from "@/hooks/useQRCode";
import { useEffect } from "react";

interface QRCodeScannerProps {
  sessionId: string;
  onLogin?: () => void; // Added onLogin as an optional prop
}

const QRCodeScanner = ({ sessionId, onLogin }: QRCodeScannerProps) => {
  const { loading, qrCodeData, status } = useQRCode(sessionId);

  useEffect(() => {
    if (status === "connected" && onLogin) {
      onLogin();
    }
  }, [status, onLogin]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {loading ? (
        <QRCodeLoading />
      ) : (
        <>
          <QRCodeInstructions />
          <QRCodeDisplay qrCodeData={qrCodeData} />
          <p className="text-sm text-center text-muted-foreground mt-4">
            O código QR será atualizado automaticamente
          </p>
        </>
      )}
    </div>
  );
};

export default QRCodeScanner;
