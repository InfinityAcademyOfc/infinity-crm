
import { useEffect, useState } from "react";
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
  const { loading, qrCodeData, status, error } = useQRCode(sessionId);
  const [startingSession, setStartingSession] = useState(false);
  const { toast } = useToast();

  // Inicializar sessão quando o componente monta
  useEffect(() => {
    const start = async () => {
      if (!sessionId || !API_URL) return;
      
      if (status === "not_started" || status === "disconnected" || status === "error") {
        try {
          setStartingSession(true);
          // O endpoint de QR já inicia a sessão conforme o controller do backend
          await fetch(`${API_URL}/sessions/${sessionId}/status`, { 
            method: "GET",
            signal: AbortSignal.timeout(10000)
          });
        } catch (error) {
          console.warn("Erro ao verificar status da sessão:", error);
        } finally {
          setStartingSession(false);
        }
      }
    };
    
    start();
  }, [sessionId, status]);

  // Notificar quando a conexão for bem-sucedida
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

  // Lidar com atualização manual do QR code
  const handleRefresh = async () => {
    if (!sessionId || !API_URL) return;
    
    try {
      // O endpoint restart inicia uma nova sessão
      await fetch(`${API_URL}/sessions/${sessionId}/restart`, { method: "POST" });
      toast({
        title: "QR Code atualizado",
        description: "Um novo código QR foi solicitado.",
      });
    } catch (error) {
      console.warn("Erro ao atualizar QR code:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {loading || startingSession ? (
        <QRCodeLoading />
      ) : status === "qr" && qrCodeData ? (
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
      ) : !sessionId ? (
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">
            Nenhuma sessão foi selecionada.
          </p>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-center text-muted-foreground font-medium">
            {status === "error" 
              ? "Não foi possível conectar ao WhatsApp. Tente novamente."
              : "Aguardando sessão iniciar..."}
          </p>
          <Button variant="outline" onClick={handleRefresh}>
            Tentar novamente
          </Button>
          <div className="animate-pulse bg-muted h-2 w-32 mx-auto rounded"></div>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
