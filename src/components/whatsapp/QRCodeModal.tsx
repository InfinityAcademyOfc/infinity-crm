
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QRCodeScanner from "./QRCodeScanner";
import { useEffect } from "react";
import { useQRCode } from "@/hooks/useQRCode";

interface QRCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  onLogin?: () => void;
}

const QRCodeModal = ({ open, onOpenChange, sessionId, onLogin }: QRCodeModalProps) => {
  const { status } = useQRCode(sessionId);
  
  // Auto-fechar o modal quando conectado
  useEffect(() => {
    if (status === "connected" && onLogin) {
      // Primeiro chama o callback de login para atualizar o estado
      onLogin();
      // Depois fecha o modal
      setTimeout(() => onOpenChange(false), 100);
    }
  }, [status, onLogin, onOpenChange]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Conectar número: {sessionId}</DialogTitle>
        </DialogHeader>
        <QRCodeScanner sessionId={sessionId} onLogin={onLogin} />
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
