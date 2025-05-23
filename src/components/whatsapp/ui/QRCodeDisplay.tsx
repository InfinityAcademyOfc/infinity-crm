
import QRCodeLoading from "./QRCodeLoading";

interface QRCodeDisplayProps {
  qrCodeData: string | null;
  loading?: boolean;
}

const QRCodeDisplay = ({ qrCodeData, loading }: QRCodeDisplayProps) => {
  if (loading) return <QRCodeLoading />;
  if (!qrCodeData) {
    return (
      <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Código QR indisponível. Aguarde alguns instantes ou recarregue a página.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="qr-container bg-white p-4 rounded-lg border-4 border-[#4fce5d] mb-3">
        {/* Exibe a imagem URL completa do QR code gerado pelo backend */}
        <img
          src={qrCodeData}
          alt="QR Code WhatsApp Web"
          className="w-64 h-64"
          loading="eager" // Alterado para carregar imediatamente
        />
      </div>
      <div className="flex items-center">
        <span className="text-sm text-[#4fce5d] font-medium">
          WhatsApp Web
        </span>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
