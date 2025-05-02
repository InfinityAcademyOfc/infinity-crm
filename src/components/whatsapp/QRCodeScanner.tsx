
import { useState } from "react";
import QRCodeLoading from "./ui/QRCodeLoading";
import QRCodeInstructions from "./ui/QRCodeInstructions";
import QRCodeDisplay from "./ui/QRCodeDisplay";
import { useQRCode } from "@/hooks/useQRCode";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRCodeScannerProps {
  sessionId: string;
  onSuccess?: () => void;
}

const QRCodeScanner = ({ sessionId, onSuccess }: QRCodeScannerProps) => {
  const { loading, qrCodeData, error, refetch } = useQRCode(sessionId);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    refetch?.();
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-2" />
        <h3 className="font-medium text-lg mb-1">Erro ao carregar o QR Code</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Não foi possível carregar o QR Code. Tente novamente mais tarde.
        </p>
        <Button onClick={handleRetry} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
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
