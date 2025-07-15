
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WhatsAppConnectionStatus } from "@/hooks/useQRCode";
import WhatsAppMenuLayout from "./WhatsAppMenuLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smartphone } from "lucide-react";
import QRCodeScanner from "./QRCodeScanner";
import { useSessions } from "@/hooks/useSessions";

const WhatsAppIntegration = () => {
  const { toast } = useToast();
  const { sessions, loading } = useSessions();

  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem("wa-session-id") || "sessao-padrao";
  });

  const [status, setStatus] = useState<WhatsAppConnectionStatus>("not_started");

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
      await fetch(`${apiUrl}/sessions/${sessionId}/logout`, { method: "POST" });
      setStatus("not_started");
      toast({ title: "Desconectado", description: "Sessão encerrada." });
    } catch {
      toast({ 
        title: "Erro", 
        description: "Erro ao desconectar.", 
        variant: "destructive" 
      });
    }
  };

  const handleLogin = () => {
    setStatus("connected");
    toast({ title: "Conectado", description: "Sessão ativa com sucesso." });
  };
  
  const handleSelectSession = (selectedSessionId: string) => {
    setSessionId(selectedSessionId);
    localStorage.setItem("wa-session-id", selectedSessionId);
  };

  const handleCreateNewSession = () => {
    const newSessionId = `sessao-${Date.now()}`;
    setSessionId(newSessionId);
    localStorage.setItem("wa-session-id", newSessionId);
    setStatus("not_started");
  };

  const availableSessions = sessions.map(session => session.id).filter(Boolean);

  return (
    <div className="space-y-4 h-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">WhatsApp</h2>
        
        <div className="flex items-center gap-2">
          {sessions.length > 0 && (
            <Tabs value={sessionId} onValueChange={handleSelectSession} className="w-auto">
              <TabsList className="h-9 bg-muted/50">
                {availableSessions.map((session) => (
                  <TabsTrigger 
                    key={session} 
                    value={session}
                    className="flex items-center gap-1 text-xs px-2 py-1.5"
                  >
                    <Smartphone size={14} />
                    {session}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
          
          <div className={`${status === "connected" ? 
              "bg-green-100 dark:bg-green-900/20 text-green-600" : 
              "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600"} 
            px-3 py-1 rounded-full flex items-center gap-2`}>
            <div className={`w-2 h-2 rounded-full ${status === "connected" ? 
              "bg-green-500 animate-pulse" : "bg-yellow-500"}`} />
            <span className="text-sm font-medium">
              {status === "connected" ? "Conectado" : "Desconectado"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-12rem)]">
        {status !== "connected" && (
          <div className="border rounded-md p-4 md:w-[350px] flex-shrink-0">
            <div className="text-center mb-4">
              <h3 className="font-medium text-lg">Conectar WhatsApp</h3>
              <p className="text-muted-foreground">Escaneie o QR Code com seu celular</p>
            </div>
            <div className="flex items-center justify-center">
              <QRCodeScanner 
                sessionId={sessionId}
                onLogin={handleLogin} 
              />
            </div>
          </div>
        )}
        
        <ScrollArea className="w-full rounded-md border">
          <WhatsAppMenuLayout
            sessionId={sessionId}
            status={status}
            onLogout={handleLogout}
          />
        </ScrollArea>
      </div>
      
      {status === "connected" && (
        <div className="flex justify-end py-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCreateNewSession} 
          >
            <Smartphone size={14} className="mr-1" />
            <span className="text-xs">Nova Sessão</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default WhatsAppIntegration;
