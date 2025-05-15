
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import QRCodeModal from "@/components/whatsapp/QRCodeModal";
import { Badge } from "@/components/ui/badge";
import { Loader, Smartphone, Plus, RefreshCw, AlertTriangle } from "lucide-react";
import { useWhatsApp } from "@/contexts/whatsapp";
import WhatsAppMenuLayout from "@/components/whatsapp/WhatsAppMenuLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

// Main content component
const WhatsAppIntegrationContent = () => {
  const { 
    currentSession, 
    setCurrentSession,
    sessions, 
    loadingSessions,
    connectionStatus,
    refreshSessions,
    createNewSession
  } = useWhatsApp();
  
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [apiError, setApiError] = useState(false);

  const handleConnectClick = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setShowModal(true);
  };
  
  const handleCreateSession = () => {
    const newSessionId = createNewSession();
    handleConnectClick(newSessionId);
  };
  
  const handleRefresh = () => {
    try {
      refreshSessions();
      setApiError(false);
    } catch (error) {
      console.error("Error refreshing sessions:", error);
      setApiError(true);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as sessões",
        variant: "destructive",
      });
    }
  };
  
  // Select current session or first available one
  useEffect(() => {
    if (!currentSession && sessions.length > 0) {
      setCurrentSession(sessions[0].id);
    }
  }, [sessions, currentSession, setCurrentSession]);

  // Check API errors from session loading
  useEffect(() => {
    if (sessions.length === 0 && !loadingSessions) {
      // If no sessions and not loading, may indicate API error
      setApiError(true);
    } else {
      setApiError(false);
    }
  }, [sessions, loadingSessions]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Integração WhatsApp</h2>
          <p className="text-muted-foreground">Gerencie suas conexões e conversas do WhatsApp</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw size={14} />
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

      {apiError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Problema de conexão</AlertTitle>
          <AlertDescription>
            Não foi possível conectar ao servidor WhatsApp. Verifique sua conexão e tente novamente.
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="mt-2"
            >
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {loadingSessions ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader className="animate-spin" size={20} />
          Carregando sessões...
        </div>
      ) : sessions.length === 0 ? (
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
          {sessions.map((session) => (
            <Card key={session.id} className={currentSession === session.id ? "border-primary/50" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {session.name || `Sessão: ${session.id}`}
                  </div>
                  <Badge variant={session.status === "CONNECTED" ? "default" : "outline"}>
                    {session.status === "CONNECTED" ? "Conectado" : "Desconectado"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Button
                    variant={session.status !== "CONNECTED" ? "default" : "outline"}
                    size="sm"
                    className="mt-2"
                    onClick={() => handleConnectClick(session.id)}
                  >
                    {session.status !== "CONNECTED" ? (
                      <>
                        <Smartphone size={14} className="mr-1" />
                        Conectar
                      </>
                    ) : (
                      <>
                        <Smartphone size={14} className="mr-1" />
                        Ver QR Code
                      </>
                    )}
                  </Button>
                  
                  {session.status === "CONNECTED" && currentSession !== session.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => setCurrentSession(session.id)}
                    >
                      Selecionar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {currentSession && (
        <div className="border rounded-lg h-[calc(100vh-15rem)]">
          <ScrollArea className="h-full rounded-md">
            <WhatsAppMenuLayout
              sessionId={currentSession}
              status={connectionStatus}
            />
          </ScrollArea>
        </div>
      )}

      <QRCodeModal
        open={showModal}
        onOpenChange={setShowModal}
        sessionId={selectedSessionId}
        onLogin={() => refreshSessions()}
      />
    </div>
  );
};

// Wrapper component
const WhatsAppIntegrationPage = () => {
  return (
    <WhatsAppIntegrationContent />
  );
};

export default WhatsAppIntegrationPage;
