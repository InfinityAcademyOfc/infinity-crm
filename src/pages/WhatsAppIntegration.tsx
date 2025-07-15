
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
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Integração com WhatsApp</h2>
        <Button 
          variant="outline" 
          onClick={() => handleConnectClick("nova-sessao")}
          className="w-full sm:w-auto"
        >
          + Conectar novo número
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground justify-center py-8">
          <Loader className="animate-spin" size={20} />
          Carregando sessões...
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhuma sessão conectada.</p>
          <Button onClick={() => handleConnectClick("primeira-sessao")}>
            Conectar primeiro número
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <div key={session.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-lg font-medium mb-2">
                {session.name || `Sessão: ${session.id}`}
              </div>
              <Badge 
                variant={session.status === "CONNECTED" ? "default" : "outline"}
                className="mb-3"
              >
                {session.status === "CONNECTED" ? "Conectado" : "Aguardando conexão"}
              </Badge>

              {session.status !== "CONNECTED" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
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
