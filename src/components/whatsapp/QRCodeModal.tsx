
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
  
  // Auto-close the modal when connected
  useEffect(() => {
    if (status === "connected" && onLogin) {
      onLogin();
      onOpenChange(false);
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
