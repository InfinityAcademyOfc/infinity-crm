
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QRCodeScanner from "./QRCodeScanner";
import { useEffect, useRef } from "react";
import { useQRCode } from "@/hooks/useQRCode";
import { Badge } from "@/components/ui/badge";

interface QRCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  onLogin?: () => void;
}

const QRCodeModal = ({ open, onOpenChange, sessionId, onLogin }: QRCodeModalProps) => {
  const { status } = useQRCode(sessionId);
  const hasLoggedIn = useRef(false);

  useEffect(() => {
    if (status === "connected" && !hasLoggedIn.current && open) {
      hasLoggedIn.current = true;
      onLogin?.();

      setTimeout(() => {
        onOpenChange(false);
        hasLoggedIn.current = false;
      }, 1500); // Tempo suficiente para ver a mensagem de sucesso
    }
  }, [status, onLogin, onOpenChange, open]);

  // Get status text and color
  const getStatusBadge = () => {
    switch (status) {
      case "connected":
        return <Badge variant="default" className="bg-green-500">Conectado</Badge>;
      case "qr":
        return <Badge variant="outline" className="text-blue-500 border-blue-200">QR Code</Badge>;
      case "disconnected":
        return <Badge variant="outline" className="text-amber-500 border-amber-200">Desconectado</Badge>;
      case "error":
        return <Badge variant="destructive">Erro</Badge>;
      default:
        return <Badge variant="outline">Iniciando</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>
              {sessionId.length > 15
                ? `Conectar: ${sessionId.substring(0, 15)}...`
                : `Conectar: ${sessionId}`}
            </DialogTitle>
            {getStatusBadge()}
          </div>
        </DialogHeader>
        <QRCodeScanner sessionId={sessionId} onLogin={onLogin} />
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
