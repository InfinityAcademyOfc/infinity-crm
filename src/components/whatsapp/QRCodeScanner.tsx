
import { Button } from "@/components/ui/button";
import QRCodeLoading from "./ui/QRCodeLoading";
import QRCodeInstructions from "./ui/QRCodeInstructions";
import QRCodeDisplay from "./ui/QRCodeDisplay";
import { useQRCode } from "@/hooks/useQRCode";

interface QRCodeScannerProps {
  onLogin: () => void;
}

const QRCodeScanner = ({ onLogin }: QRCodeScannerProps) => {
  const { loading, qrCodeData } = useQRCode();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {loading ? (
        <QRCodeLoading />
      ) : (
        <>
          <QRCodeInstructions />

          <QRCodeDisplay qrCodeData={qrCodeData} />

          <p className="text-sm text-center text-muted-foreground mt-4">
            O código QR será atualizado a cada 30 segundos
          </p>
          
          {/* Simular login (apenas para demonstração) */}
          <Button 
            variant="outline" 
            className="mt-6" 
            onClick={onLogin}
          >
            Simular login (apenas para demonstração)
          </Button>
        </>
      )}
    </div>
  );
};

export default QRCodeScanner;
