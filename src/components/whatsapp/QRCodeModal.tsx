import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QRCodeScanner from "./QRCodeScanner";

interface QRCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  onLogin?: () => void;
}

const QRCodeModal = ({ open, onOpenChange, sessionId, onLogin }: QRCodeModalProps) => {
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
