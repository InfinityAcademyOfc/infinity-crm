
import { useEffect, useState } from "react";
import QRCodeLoading from "@/components/whatsapp/ui/QRCodeLoading";
import QRCodeInstructions from "@/components/whatsapp/ui/QRCodeInstructions";
import QRCodeDisplay from "@/components/whatsapp/ui/QRCodeDisplay";
import { useQRCode } from "@/hooks/useQRCode";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "";

interface QRCodeScannerProps {
  sessionId: string;
  onLogin?: () => void;
}

const QRCodeScanner = ({ sessionId, onLogin }: QRCodeScannerProps) => {
  const { loading, qrCodeData, status, error } = useQRCode(sessionId);
  const [startingSession, setStartingSession] = useState(false);
  const { toast } = useToast();

  // Initialize session when component mounts
  useEffect(() => {
    const start = async () => {
      if (!sessionId || !API_URL) return;
      
      if (status === "not_started" || status === "disconnected" || status === "error") {
        try {
          setStartingSession(true);
          console.log("Starting WhatsApp session:", sessionId);
          await fetch(`${API_URL}/sessions/${sessionId}/start`, { method: "POST" });
        } catch (error) {
          console.error("Error starting session:", error);
        } finally {
          setStartingSession(false);
        }
      }
    };
    
    start();
  }, [sessionId, status]);

  // Notify when connection is successful
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

  // Handle manual refresh of QR code
  const handleRefresh = async () => {
    if (!sessionId || !API_URL) return;
    
    try {
      await fetch(`${API_URL}/sessions/${sessionId}/restart`, { method: "POST" });
      toast({
        title: "QR Code atualizado",
        description: "Um novo código QR foi solicitado.",
      });
    } catch (error) {
      console.error("Error refreshing QR code:", error);
    }
  };

  // Check if API is available
  if (!API_URL) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="text-amber-500 mb-2 h-10 w-10" />
        <h3 className="font-medium text-lg mb-2">API não configurada</h3>
        <p className="text-sm text-muted-foreground">
          O servidor do WhatsApp não está configurado. Configure a variável de ambiente VITE_API_URL.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {loading || startingSession ? (
        <QRCodeLoading />
      ) : status === "qr" ? (
        <>
          <QRCodeInstructions />
          <QRCodeDisplay qrCodeData={qrCodeData} />
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Escaneie o código QR com seu WhatsApp para conectar.
            </p>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center gap-1">
              <RefreshCw size={14} />
              Atualizar QR Code
            </Button>
          </div>
        </>
      ) : status === "connected" ? (
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 font-medium text-green-600 bg-green-100 dark:bg-green-900/20 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Dispositivo conectado com sucesso!
          </div>
          <p className="text-sm text-muted-foreground">
            Você já pode utilizar o WhatsApp no sistema.
          </p>
        </div>
      ) : error ? (
        <div className="text-center space-y-4">
          <p className="text-center text-amber-500 font-medium">
            {error}
          </p>
          <Button variant="outline" onClick={handleRefresh}>
            Tentar novamente
          </Button>
        </div>
      ) : (
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">
            Aguardando sessão iniciar...
          </p>
          <div className="animate-pulse bg-muted h-2 w-32 mx-auto rounded"></div>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
