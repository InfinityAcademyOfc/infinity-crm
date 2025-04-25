
import { useState } from "react";
import { QrCode, Smartphone, CheckCircle, MessageCircle, Clock, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import QRCodeScanner from "./QRCodeScanner";
import WhatsAppChat from "./WhatsAppChat";
import WhatsAppSettings from "./WhatsAppSettings";
import WhatsAppAutomation from "./WhatsAppAutomation";

const WhatsAppIntegration = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("qrcode");
  const { toast } = useToast();

  const handleLogin = () => {
    setIsLoggedIn(true);
    setActiveTab("chat");
    toast({
      title: "WhatsApp conectado",
      description: "Sua conta do WhatsApp foi conectada com sucesso.",
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab("qrcode");
    toast({
      title: "WhatsApp desconectado",
      description: "Sua conta do WhatsApp foi desconectada.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">WhatsApp Business</h2>
          <p className="text-muted-foreground">
            Integre o WhatsApp Web com seu CRM para gerenciar contatos e mensagens.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          {isLoggedIn && (
            <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full">
              <CheckCircle size={14} />
              <span className="text-sm font-medium">Conectado</span>
            </div>
          )}
          
          {!isLoggedIn && (
            <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full">
              <Smartphone size={14} />
              <span className="text-sm font-medium">Não Conectado</span>
            </div>
          )}
          
          {isLoggedIn && (
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              size="sm"
            >
              Desconectar
            </Button>
          )}
        </div>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-2">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="qrcode" disabled={isLoggedIn}>
                <QrCode className="mr-2 h-4 w-4" />
                QR Code
              </TabsTrigger>
              <TabsTrigger value="chat" disabled={!isLoggedIn}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Conversas
              </TabsTrigger>
              <TabsTrigger value="automation" disabled={!isLoggedIn}>
                <Clock className="mr-2 h-4 w-4" />
                Automações
              </TabsTrigger>
              <TabsTrigger value="settings" disabled={!isLoggedIn}>
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </TabsTrigger>
            </TabsList>
            
            <CardContent className="flex-1 p-0 overflow-hidden">
              <TabsContent value="qrcode" className="mt-0 h-full">
                <QRCodeScanner onLogin={handleLogin} />
              </TabsContent>
              <TabsContent value="chat" className="mt-0 h-full">
                <WhatsAppChat />
              </TabsContent>
              <TabsContent value="automation" className="mt-0 h-full">
                <WhatsAppAutomation />
              </TabsContent>
              <TabsContent value="settings" className="mt-0 h-full">
                <WhatsAppSettings />
              </TabsContent>
            </CardContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
};

export default WhatsAppIntegration;
