
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Users, 
  Settings, 
  Send, 
  FileImage,
  Calendar, 
  ListOrdered, 
  Zap,
  QrCode
} from "lucide-react";
import WhatsAppConversations from "./WhatsAppConversations";
import ContactsManager from "./contacts/ContactsManager";
import ListsManager from "./lists/ListsManager";
import BroadcastManager from "./broadcasts/BroadcastManager";
import MediaManager from "./media/MediaManager";
import ScheduleManager from "./schedules/ScheduleManager";
import WhatsAppConfig from "./config/WhatsAppConfig";
import AutomationsManager from "./automations/AutomationsManager";
import { useQRCode } from "@/hooks/useQRCode";
import { Button } from "@/components/ui/button";
import QRCodeScanner from "./QRCodeScanner";
import { useToast } from "@/hooks/use-toast";

interface WhatsAppMenuLayoutProps {
  sessionId?: string;
}

const WhatsAppMenuLayout = ({ sessionId = "teste" }: WhatsAppMenuLayoutProps) => {
  const [activeTab, setActiveTab] = useState("conversations");
  const { status } = useQRCode(sessionId);
  const { toast } = useToast();
  const [showQRCode, setShowQRCode] = useState(false);
  
  useEffect(() => {
    // Log status for debugging
    console.log("WhatsAppMenuLayout status:", status);
    
    // If connection is lost, show appropriate message
    if (status !== "connected" && activeTab !== "settings") {
      setActiveTab("conversations");
    }
  }, [status]);

  const handleLogin = () => {
    setShowQRCode(false);
    toast({
      title: "WhatsApp Conectado",
      description: "Seu dispositivo foi conectado com sucesso ao WhatsApp.",
    });
  };

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

  const renderTabContent = () => {
    // If showing QR Code scanner
    if (showQRCode) {
      return (
        <div className="p-4">
          <QRCodeScanner sessionId={sessionId} onLogin={handleLogin} />
        </div>
      );
    }
    
    // If not connected and not on settings tab
    if (status !== "connected" && activeTab !== "settings") {
      return (
        <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
          <p className="text-muted-foreground mb-4">
            Aguardando conexão com o WhatsApp para exibir o conteúdo...
          </p>
          <Button 
            variant="outline"
            onClick={() => setShowQRCode(true)}
            className="flex items-center gap-2"
          >
            <QrCode size={16} />
            Conectar WhatsApp
          </Button>
        </div>
      );
    }
    
    switch (activeTab) {
      case "conversations":
        return <WhatsAppConversations sessionId={sessionId} />;
      case "contacts":
        return <ContactsManager />;
      case "lists":
        return <ListsManager />;
      case "broadcasts":
        return <BroadcastManager />;
      case "schedules":
        return <ScheduleManager />;
      case "media":
        return <MediaManager />;
      case "automations":
        return <AutomationsManager />;
      case "settings":
        return <WhatsAppConfig />;
      default:
        return <WhatsAppConversations sessionId={sessionId} />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <div>
          {status === "connected" && (
            <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full">
              <span className="text-sm font-medium">WhatsApp Conectado</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowQRCode(true)}
          >
            Conectar novo número
          </Button>
          
          {status === "connected" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
            >
              Desconectar
            </Button>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-4 border-b">
          <TabsList className="h-auto p-0 bg-transparent overflow-x-auto w-full justify-start">
            <TabsTrigger value="conversations" className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <MessageSquare className="mr-2 h-4 w-4" />
              Conversas
            </TabsTrigger>
            
            <TabsTrigger value="contacts" className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none" disabled={status !== "connected"}>
              <Users className="mr-2 h-4 w-4" />
              Contatos
            </TabsTrigger>
            
            <TabsTrigger value="lists" className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none" disabled={status !== "connected"}>
              <ListOrdered className="mr-2 h-4 w-4" />
              Listas
            </TabsTrigger>
            
            <TabsTrigger value="broadcasts" className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none" disabled={status !== "connected"}>
              <Send className="mr-2 h-4 w-4" />
              Broadcast
            </TabsTrigger>
            
            <TabsTrigger value="schedules" className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none" disabled={status !== "connected"}>
              <Calendar className="mr-2 h-4 w-4" />
              Agendamentos
            </TabsTrigger>
            
            <TabsTrigger value="media" className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none" disabled={status !== "connected"}>
              <FileImage className="mr-2 h-4 w-4" />
              Mídia
            </TabsTrigger>
            
            <TabsTrigger value="automations" className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none" disabled={status !== "connected"}>
              <Zap className="mr-2 h-4 w-4" />
              Automações
            </TabsTrigger>
            
            <TabsTrigger value="settings" className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>
        </div>
        
        {renderTabContent()}
      </Tabs>
    </div>
  );
};

export default WhatsAppMenuLayout;
