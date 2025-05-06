
import { useEffect, useState } from "react";
import { QrCode, Smartphone, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import QRCodeScanner from "./QRCodeScanner";
import { Skeleton } from "@/components/ui/skeleton";
import WhatsAppMenuLayout from "./WhatsAppMenuLayout";
import { WhatsAppConnectionStatus } from "@/hooks/useQRCode";

const WhatsAppIntegration = () => {
  const [status, setStatus] = useState<WhatsAppConnectionStatus>("not_started");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("qrcode");
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
        setStatus(data.status);
        
        // If connected, automatically switch to chat tab
        if (data.status === "connected") {
          setActiveTab("chat");
        }
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
      setActiveTab("qrcode");
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

  const handleLogin = () => {
    setStatus("connected");
    setActiveTab("chat");
    toast({
      title: "Sessão conectada",
      description: "Você está conectado ao WhatsApp."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Integração WhatsApp</h2>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : status === "connected" ? (
            <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full">
              <CheckCircle size={14} />
              <span className="text-sm font-medium">Conectado</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full">
              <Smartphone size={14} />
              <span className="text-sm font-medium">Não conectado</span>
            </div>
          )}

          {!isLoading && status === "connected" && (
            <Button variant="destructive" onClick={handleLogout} size="sm">
              Desconectar
            </Button>
          )}
        </div>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center h-[600px]">
            <Skeleton className="h-[500px] w-full" />
          </div>
        ) : (
          <CardContent className="p-0">
            {status === "connected" ? (
              <WhatsAppMenuLayout />
            ) : (
              <div className="h-[600px] flex flex-col">
                <div className="p-4 border-b">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="qrcode">
                        <QrCode className="mr-2 h-4 w-4" />
                        QR Code
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <QRCodeScanner sessionId={sessionId} onLogin={handleLogin} />
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default WhatsAppIntegration;
