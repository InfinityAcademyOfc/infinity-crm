
interface QRCodeDisplayProps {
  qrCodeData: string;
}

const QRCodeDisplay = ({ qrCodeData }: QRCodeDisplayProps) => (
  <div className="flex flex-col items-center">
    <div className="qr-container bg-white p-4 rounded-lg border-4 border-[#4fce5d] mb-3">
      <img 
        src={qrCodeData} 
        alt="QR Code WhatsApp Web"
        className="w-64 h-64"
      />
    </div>
    <div className="flex items-center">
      <img 
        src="https://static.whatsapp.net/rsrc.php/v3/y7/r/DSxEJwZ0JWn.png" 
        alt="WhatsApp Logo" 
        width="20" 
        height="20" 
        className="mr-2"
      />
      <span className="text-sm text-[#4fce5d] font-medium">WhatsApp Web</span>
    </div>
  </div>
);

export default QRCodeDisplay;
