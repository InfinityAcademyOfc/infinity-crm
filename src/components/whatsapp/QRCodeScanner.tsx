import { useEffect } from "react";
import QRCodeLoading from "@/components/whatsapp/ui/QRCodeLoading";
import QRCodeInstructions from "@/components/whatsapp/ui/QRCodeInstructions";
import QRCodeDisplay from "@/components/whatsapp/ui/QRCodeDisplay";
import { useQRCode } from "@/hooks/useQRCode";
import { useToast } from "@/hooks/use-toast";
import { logError } from "@/utils/logger"; // Importar o logger

const API_URL = import.meta.env.VITE_API_URL || "";

interface QRCodeScannerProps {
  sessionId: string;
  onLogin?: () => void;
}

const QRCodeScanner = ({ sessionId, onLogin }: QRCodeScannerProps) => {
  const { loading, qrCodeData, status } = useQRCode(sessionId);
  const { toast } = useToast();

  useEffect(() => {
    const start = async () => {
      try {
        await fetch(`${API_URL}/sessions/${sessionId}/start`, { method: "POST" });
      } catch (error) {
        logError("Erro ao iniciar sessão:", error, { component: "QRCodeScanner" });
      }
    };
    if (sessionId) start();
  }, [sessionId]);

  useEffect(() => {
    if (status === "connected" && onLogin) {
      toast({
        title: "WhatsApp Conectado",
        description: "Seu dispositivo foi conectado com sucesso ao WhatsApp.",
        variant: "default"
      });
      onLogin();
    }
  }, [status, onLogin, toast]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {loading ? (
        <QRCodeLoading />
      ) : status === "qr" && qrCodeData ? (
        <>
          <QRCodeInstructions />
          <QRCodeDisplay qrCodeData={qrCodeData} />
          <p className="text-sm text-center text-muted-foreground mt-4">
            O código QR será atualizado automaticamente a cada 15 segundos.
          </p>
        </>
      ) : status === "connected" ? (
        <p className="text-center text-green-600 font-medium mt-4">
          Dispositivo conectado com sucesso!
        </p>
      ) : status === "error" ? (
        <p className="text-center text-red-500 font-medium mt-4">
          Ocorreu um erro ao carregar o QR Code.
        </p>
      ) : (
        <p className="text-center text-muted-foreground mt-4">
          Aguardando sessão iniciar...
        </p>
      )}
    </div>
  );
};

export default QRCodeScanner;


