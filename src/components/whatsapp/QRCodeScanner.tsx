import QRCodeLoading from "./ui/QRCodeLoading";
import QRCodeInstructions from "./ui/QRCodeInstructions";
import QRCodeDisplay from "./ui/QRCodeDisplay";
import { useQRCode } from "@/hooks/useQRCode";

interface QRCodeScannerProps {
  sessionId: string;
}

const QRCodeScanner = ({ sessionId }: QRCodeScannerProps) => {
  const { loading, qrCodeData } = useQRCode(sessionId);

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
