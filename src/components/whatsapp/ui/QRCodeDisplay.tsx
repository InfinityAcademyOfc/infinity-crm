
import { Loader2 } from "lucide-react";

interface QRCodeDisplayProps {
  qrCodeData: string;
}

const QRCodeDisplay = ({ qrCodeData }: QRCodeDisplayProps) => {
  if (!qrCodeData) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#4fce5d]" />
        <p className="mt-2 text-sm text-muted-foreground">Carregando QR Code...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="qr-container bg-white p-4 rounded-lg border-4 border-[#4fce5d] mb-3 shadow-lg">
        <img
          src={qrCodeData}
          alt="QR Code WhatsApp Web"
          className="w-64 h-64"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-sm text-[#4fce5d] font-medium mb-1">
          WhatsApp Web
        </span>
        <p className="text-xs text-center text-muted-foreground max-w-[250px]">
          Escaneie o código QR com seu WhatsApp para conectar
        </p>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
