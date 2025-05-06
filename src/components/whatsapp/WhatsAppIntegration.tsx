
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { WhatsAppConnectionStatus } from "@/hooks/useQRCode";
import QRCodeScanner from "./QRCodeScanner";
import QRCodeModal from "./QRCodeModal";
import WhatsAppMenuLayout from "./WhatsAppMenuLayout";

const WhatsAppIntegration = () => {
  const [status, setStatus] = useState<WhatsAppConnectionStatus>("not_started");
  const [isLoading, setIsLoading] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);
  const [newSessionId, setNewSessionId] = useState("nova-sessao");
  const { toast } = useToast();
  const sessionId = "teste"; // pode ser dinâmico no futuro

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
          console.error("API URL não definida");
          setStatus("error");
          setIsLoading(false);
          return;
        }

        const res = await fetch(`${apiUrl}/sessions/${sessionId}/status`);
        if (!res.ok) {
          throw new Error(`Falha ao buscar status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("WhatsApp status fetch:", data.status);
        setStatus(data.status as WhatsAppConnectionStatus);
      } catch (err) {
        console.error("Erro ao verificar status da sessão:", err);
        setStatus("error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        throw new Error("API URL não definida");
      }

      const res = await fetch(`${apiUrl}/sessions/${sessionId}/logout`, {
        method: 'POST'
      });
      
      if (!res.ok) {
        throw new Error(`Falha ao fazer logout: ${res.status}`);
      }
      
      setStatus("not_started");
      toast({
        title: "Sessão desconectada",
        description: "Você foi desconectado do WhatsApp com sucesso."
      });
    } catch (err) {
      console.error("Erro ao desconectar:", err);
      toast({
        title: "Erro ao desconectar",
        description: "Não foi possível desconectar do WhatsApp.",
        variant: "destructive"
      });
    }
  };

  const handleShowQrCode = () => {
    setShowQrModal(true);
  };

  const handleLogin = () => {
    setStatus("connected");
    toast({
      title: "Sessão conectada",
      description: "Você está conectado ao WhatsApp."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Integração WhatsApp</h2>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <WhatsAppMenuLayout 
            sessionId={sessionId} 
            onShowQrCode={handleShowQrCode}
            onLogout={handleLogout}
          />
        </CardContent>
      </Card>

      <QRCodeModal
        open={showQrModal}
        onOpenChange={setShowQrModal}
        sessionId={newSessionId}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default WhatsAppIntegration;
