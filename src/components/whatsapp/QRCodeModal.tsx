import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QRCodeScanner from "./QRCodeScanner";
import { useEffect, useRef } from "react";
import { useQRCode } from "@/hooks/useQRCode";

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
    if (status === "connected" && !hasLoggedIn.current) {
      hasLoggedIn.current = true;
      onLogin?.();

      setTimeout(() => {
        onOpenChange(false);
        hasLoggedIn.current = false;
      }, 500); // leve atraso para garantir atualização de status
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
