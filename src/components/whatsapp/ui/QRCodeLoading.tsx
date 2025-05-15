
import { LoaderCircle } from "lucide-react";

const QRCodeLoading = () => (
  <div className="flex flex-col items-center justify-center">
    <LoaderCircle size={50} className="animate-spin text-primary mb-4" />
    <p className="text-center text-muted-foreground">Carregando QR Code...</p>
  </div>
);

export default QRCodeLoading;
