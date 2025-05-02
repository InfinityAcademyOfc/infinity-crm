import { useState } from "react";
import { Button } from "@/components/ui/button";
import QRCodeModal from "@/components/whatsapp/QRCodeModal";
import { useSessions } from "@/hooks/useSessions";
import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react";

const WhatsAppIntegration = () => {
  const { sessions, loading } = useSessions();
  const [showModal, setShowModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState("");

  const handleConnectClick = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Integração com WhatsApp</h2>

      <Button variant="outline" className="mb-6" onClick={() => handleConnectClick("nova-sessao")}>
        + Conectar novo número
      </Button>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader className="animate-spin" size={20} />
          Carregando sessões...
        </div>
      ) : sessions.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma sessão conectada.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <div key={session.id} className="border rounded-lg p-4 shadow-sm">
              <div className="text-lg font-medium mb-1">
                {session.name || `Sessão: ${session.id}`}
              </div>
              <Badge variant={session.status === "CONNECTED" ? "default" : "outline"}>
                {session.status === "CONNECTED" ? "Conectado" : "Aguardando conexão"}
              </Badge>

              {session.status !== "CONNECTED" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4"
                  onClick={() => handleConnectClick(session.id)}
                >
                  Ver QR Code
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <QRCodeModal
        open={showModal}
        onOpenChange={setShowModal}
        sessionId={selectedSessionId}
      />
    </div>
  );
};

export default WhatsAppIntegration;
