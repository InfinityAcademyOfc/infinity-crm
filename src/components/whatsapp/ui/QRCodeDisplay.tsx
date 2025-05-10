
interface QRCodeDisplayProps {
  qrCodeData: string;
}

const QRCodeDisplay = ({ qrCodeData }: QRCodeDisplayProps) => {
  if (!qrCodeData) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="qr-container bg-white p-4 rounded-lg border-4 border-[#4fce5d] mb-3">
        {/* Display the QR code as an image if it's a data URL */}
        {qrCodeData.startsWith('data:image') ? (
          <img
            src={qrCodeData}
            alt="WhatsApp Web QR Code"
            className="w-64 h-64"
            loading="lazy"
          />
        ) : (
          /* If it's not an image URL, assume it's text that needs to be converted to a QR code */
          <div className="w-64 h-64 flex items-center justify-center text-center">
            <p>QR Code data available but not in image format</p>
          </div>
        )}
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
