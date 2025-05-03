
import QRCodeLoading from "./ui/QRCodeLoading";
import QRCodeInstructions from "./ui/QRCodeInstructions";
import QRCodeDisplay from "./ui/QRCodeDisplay";
import { useQRCode } from "@/hooks/useQRCode";
import { useCallback } from "react";

interface QRCodeScannerProps {
  sessionId: string;
  onLogin?: () => void; // Tornamos opcional com "?"
}

const QRCodeScanner = ({ sessionId, onLogin }: QRCodeScannerProps) => {
  const { loading, qrCodeData } = useQRCode(sessionId);
  
  // Simulação de login quando o QR code é escaneado
  const handleQrCodeScanned = useCallback(() => {
    if (onLogin && qrCodeData) {
      onLogin();
    }
  }, [onLogin, qrCodeData]);
  
  // Se temos dados do QR e uma função onLogin, chame-a depois de um tempo
  // simulando que alguém escaneou o código
  if (qrCodeData && onLogin) {
    // Em ambiente real, isso seria disparado por um evento do backend
    setTimeout(handleQrCodeScanned, 5000);
  }

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
