// src/components/whatsapp/WhatsAppIntegration.tsx
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { WhatsAppConnectionStatus } from "@/hooks/useQRCode";
import QRCodeModal from "./QRCodeModal";
import WhatsAppMenuLayout from "./WhatsAppMenuLayout";

const WhatsAppIntegration = () => {
  const [status, setStatus] = useState<WhatsAppConnectionStatus>("not_started","connected");
  const [showQrModal, setShowQrModal] = useState(false);
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState(() => {
  // tenta recuperar do localStorage ou define um padrão
  return localStorage.getItem("wa-session-id") || "sessao-padrao";
<input
  value={sessionId}
  onChange={(e) => {
    const value = e.target.value;
    setSessionId(value);
    localStorage.setItem("wa-session-id", value);
  }}
  placeholder="Digite o nome da sessão"
/>
});

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) throw new Error("VITE_API_URL não definida");
        const res = await fetch(`${apiUrl}/sessions/${sessionId}/status`);
        const data = await res.json();
        setStatus(data.status);
      } catch {
        setStatus("error");
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 7000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const handleLogout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await fetch(`${apiUrl}/sessions/${sessionId}/logout`, { method: 'POST' });
      setStatus("not_started");
      toast({ title: "Desconectado", description: "Sessão encerrada." });
    } catch {
      toast({ title: "Erro", description: "Erro ao desconectar.", variant: "destructive" });
    }
  };

  const handleLogin = () => {
    setStatus("connected");
    setShowQrModal(false);
    toast({ title: "Conectado", description: "Sessão ativa com sucesso." });
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
            status={status}
            onShowQrCode={() => setShowQrModal(true)}
            onLogout={handleLogout}
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
