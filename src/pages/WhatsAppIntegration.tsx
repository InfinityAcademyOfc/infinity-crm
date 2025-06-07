
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import QRCodeModal from "@/components/whatsapp/QRCodeModal";
import { Badge } from "@/components/ui/badge";
import { Loader, Smartphone, Plus, RefreshCw } from "lucide-react";
import WhatsAppMenuLayout from "@/components/whatsapp/WhatsAppMenuLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWhatsApp } from "@/contexts/WhatsAppContext";

// Card individual para uma sessão
const WhatsAppSessionCard = ({
  session,
  isActive,
  onConnect,
  onSelect
}: {
  session: any;
  isActive: boolean;
  onConnect: () => void;
  onSelect: () => void;
}) => {
  const isConnected = session.status?.toLowerCase() === "connected";

  return (
    <Card key={session.id} className={isActive ? "border-primary/50" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="font-medium">{session.name || `Sessão: ${session.id.substring(0, 8)}...`}</div>
          <Badge variant={isConnected ? "default" : "outline"}>
            {isConnected ? "Conectado" : "Desconectado"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Button
            variant={!isConnected ? "default" : "outline"}
            size="sm"
            className="mt-2"
            onClick={onConnect}
          >
            <Smartphone size={14} className="mr-1" />
            {!isConnected ? "Conectar" : "Ver QR Code"}
          </Button>

          {isConnected && !isActive && (
            <Button variant="ghost" size="sm" className="mt-2" onClick={onSelect}>
              Selecionar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const WhatsAppIntegrationPage = () => {
  const {
    currentSession,
    setCurrentSession,
    sessions,
    loadingSessions,
    refreshSessions,
    createNewSession,
    connectionStatus
  } = useWhatsApp();

  const [showModal, setShowModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState("");

  const handleConnectClick = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setShowModal(true);
  };

  const handleCreateSession = async () => {
    const newSessionId = await createNewSession();
    if (newSessionId) {
      handleConnectClick(newSessionId);
    }
  };

  // Selecionar sessão atual ou primeira disponível
  useEffect(() => {
    if (!currentSession && sessions?.length > 0) {
      setCurrentSession(sessions[0].id);
    }
  }, [sessions, currentSession, setCurrentSession]);

  // Encontrar dados da sessão atual
  const currentSessionData = sessions?.find((s) => s.id === currentSession);
  const isCurrentSessionConnected = currentSessionData?.status?.toLowerCase() === "connected";

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Integração WhatsApp</h2>
          <p className="text-muted-foreground">
            Gerencie suas conexões e conversas do WhatsApp
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshSessions}
            className="flex items-center gap-1"
            disabled={loadingSessions}
          >
            {loadingSessions ? (
              <Loader size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            Atualizar
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleCreateSession}
            className="flex items-center gap-1"
          >
            <Plus size={14} />
            Conectar novo número
          </Button>
        </div>
      </div>

      {loadingSessions && sessions.length === 0 ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader className="animate-spin" size={20} />
          Carregando sessões...
        </div>
      ) : sessions?.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo ao Infinity WhatsApp</CardTitle>
            <CardDescription>
              Você ainda não tem nenhuma sessão conectada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCreateSession}>
              <Plus size={16} className="mr-2" />
              Conectar seu primeiro número
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {sessions?.map((session) => (
            <WhatsAppSessionCard
              key={session.id}
              session={session}
              isActive={currentSession === session.id}
              onConnect={() => handleConnectClick(session.id)}
              onSelect={() => setCurrentSession(session.id)}
            />
          ))}
        </div>
      )}

      {isCurrentSessionConnected && (
        <div className="border rounded-lg h-[calc(100vh-15rem)]">
          <ScrollArea className="h-full rounded-md">
            <WhatsAppMenuLayout />
          </ScrollArea>
        </div>
      )}

      <QRCodeModal
        open={showModal}
        onOpenChange={setShowModal}
        sessionId={selectedSessionId}
        onLogin={refreshSessions}
      />
    </div>
  );
};

export default WhatsAppIntegrationPage;
