
import { useEffect, useState } from "react";
import { QrCode, Smartphone, CheckCircle, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import QRCodeScanner from "./QRCodeScanner";
import WhatsAppConversations from "./WhatsAppConversations";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

const sessionId = "teste"; // pode ser dinâmico no futuro

const WhatsAppIntegration = () => {
  const [status, setStatus] = useState<"not_started" | "qr" | "connected" | "disconnected" | "error">("not_started");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("qrcode");
  const { toast } = useToast();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/sessions/${sessionId}/status`);
        setStatus(res.data.status);
        if (res.data.status === "connected") {
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
      await axios.post(`${import.meta.env.VITE_API_URL}/sessions/${sessionId}/logout`);
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

  // Always render something even while loading
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div></div>
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

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="qrcode">
                <QrCode className="mr-2 h-4 w-4" />
                QR Code
              </TabsTrigger>
              <TabsTrigger value="chat" disabled={!isLoading && status !== "connected"}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Conversas
              </TabsTrigger>
            </TabsList>

            <CardContent className="flex-1 p-0 overflow-hidden">
              <TabsContent value="qrcode" className="mt-0 h-full">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-[500px] w-full" />
                  </div>
                ) : (
                  <QRCodeScanner sessionId={sessionId} onLogin={handleLogin} />
                )}
              </TabsContent>

              <TabsContent value="chat" className="mt-0 h-full">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-[500px] w-full" />
                  </div>
                ) : (
                  <WhatsAppConversations sessionId={sessionId} />
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
};

export default WhatsAppIntegration;
