
import { useEffect } from "react";
import QRCodeLoading from "@/components/whatsapp/ui/QRCodeLoading";
import QRCodeInstructions from "@/components/whatsapp/ui/QRCodeInstructions";
import QRCodeDisplay from "@/components/whatsapp/ui/QRCodeDisplay";
import { useQRCode } from "@/hooks/useQRCode";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "";

interface QRCodeScannerProps {
  sessionId: string;
  onLogin?: () => void;
}

const QRCodeScanner = ({ sessionId, onLogin }: QRCodeScannerProps) => {
  const { loading, qrCodeData, status } = useQRCode(sessionId);
  const { toast } = useToast();

  // Initialize session when component mounts
  useEffect(() => {
    const start = async () => {
      try {
        if (!sessionId || !API_URL) return;
        
        console.log("Starting WhatsApp session:", sessionId);
        await fetch(`${API_URL}/sessions/${sessionId}/start`, { method: "POST" });
      } catch (error) {
        console.error("Error starting session:", error);
        toast({
          title: "Erro",
          description: "Não foi possível iniciar a sessão do WhatsApp",
          variant: "destructive"
        });
      }
    };
    
    if (sessionId && status !== "connected") {
      start();
    }
  }, [sessionId, status, toast]);

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
    try {
      if (!sessionId || !API_URL) return;
      
      await fetch(`${API_URL}/sessions/${sessionId}/restart`, { method: "POST" });
      toast({
        title: "QR Code atualizado",
        description: "Um novo código QR foi solicitado.",
      });
    } catch (error) {
      console.error("Error refreshing QR code:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o código QR",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {loading ? (
        <QRCodeLoading />
      ) : status === "qr" && qrCodeData ? (
        <>
          <QRCodeInstructions />
          <QRCodeDisplay qrCodeData={qrCodeData} />
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              O código QR será atualizado automaticamente a cada 15 segundos.
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
      ) : status === "error" ? (
        <div className="text-center space-y-4">
          <p className="text-center text-red-500 font-medium">
            Ocorreu um erro ao carregar o QR Code.
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
