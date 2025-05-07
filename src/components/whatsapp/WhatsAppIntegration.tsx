import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { WhatsAppConnectionStatus } from "@/hooks/useQRCode";
import QRCodeModal from "./QRCodeModal";
import WhatsAppMenuLayout from "./WhatsAppMenuLayout";

const WhatsAppIntegration = () => {
  const [status, setStatus] = useState<WhatsAppConnectionStatus>("not_started");
  const [isLoading, setIsLoading] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);
  const { toast } = useToast();

  const sessionId = "nova-sessao"; // pode tornar dinâmico no futuro

  // Busca status do backend periodicamente
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) throw new Error("API URL não definida");

        const res = await fetch(`${apiUrl}/sessions/${sessionId}/status`);
        if (!res.ok) throw new Error(`Erro ao buscar status: ${res.status}`);

        const data = await res.json();
        console.log("🔁 Status atualizado:", data.status);
        setStatus(data.status as WhatsAppConnectionStatus);
      } catch (err) {
        console.error("Erro ao verificar status:", err);
        setStatus("error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 7000); // atualiza a cada 7s
    return () => clearInterval(interval);
  }, [sessionId]);

  // Desconectar sessão
  const handleLogout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) throw new Error("API URL não definida");

      const res = await fetch(`${apiUrl}/sessions/${sessionId}/logout`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error("Erro ao desconectar");

      setStatus("not_started");
      toast({
        title: "Desconectado",
        description: "WhatsApp desconectado com sucesso.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro ao desconectar",
        description: "Falha ao desconectar do WhatsApp.",
        variant: "destructive",
      });
    }
  };

  // Mostra modal QR
  const handleShowQrCode = () => {
    setShowQrModal(true);
  };

  // Ao logar com sucesso
  const handleLogin = () => {
    setStatus("connected");
    setShowQrModal(false);
    toast({
      title: "Conectado",
      description: "Dispositivo conectado com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Integração com WhatsApp</h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <WhatsAppMenuLayout
            sessionId={sessionId}
            onShowQrCode={handleShowQrCode}
            onLogout={handleLogout}
            status={status} // 🔥 Passa status para o layout
          />
        </CardContent>
      </Card>

      <QRCodeModal
        open={showQrModal}
        onOpenChange={setShowQrModal}
        sessionId={sessionId}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default WhatsAppIntegration;
