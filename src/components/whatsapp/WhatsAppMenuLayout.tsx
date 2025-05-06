
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
  AlertCircle,
  Smartphone,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import WhatsAppConversations from "./WhatsAppConversations";
import ContactsManager from "./contacts/ContactsManager";
import ListsManager from "./lists/ListsManager";
import BroadcastManager from "./broadcasts/BroadcastManager";
import MediaManager from "./media/MediaManager";
import ScheduleManager from "./schedules/ScheduleManager";
import WhatsAppConfig from "./config/WhatsAppConfig";
import AutomationsManager from "./automations/AutomationsManager";
import { useQRCode } from "@/hooks/useQRCode";
import QRCodeModal from "./QRCodeModal";

interface WhatsAppMenuLayoutProps {
  sessionId?: string;
  onShowQrCode?: () => void;
  onLogout?: () => void;
}

const WhatsAppMenuLayout = ({ 
  sessionId = "teste",
  onShowQrCode,
  onLogout
}: WhatsAppMenuLayoutProps) => {
  const [activeTab, setActiveTab] = useState("conversations");
  const { status } = useQRCode(sessionId);
  const [showQrModal, setShowQrModal] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Log status for debugging
    console.log("WhatsAppMenuLayout status:", status);
  }, [status]);

  const handleDisconnect = () => {
    if (onLogout) {
      onLogout();
      toast({
        title: "WhatsApp desconectado",
        description: "Sua sessão do WhatsApp foi desconectada com sucesso."
      });
    }
  };

  const handleNewConnection = () => {
    setShowQrModal(true);
  };

  const handleLogin = () => {
    toast({
      title: "WhatsApp Conectado",
      description: "Novo número conectado com sucesso!"
    });
  };

  const renderContent = () => {
    if (status !== "connected") {
      return (
        <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 mb-4 animate-pulse" />
          <p className="text-muted-foreground text-lg">
            Aguardando conexão com o WhatsApp para acessar seus contatos e mensagens...
          </p>
          <p className="mt-2 text-sm text-muted-foreground mb-6">
            Escaneie o QR Code para continuar.
          </p>
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={onShowQrCode}
          >
            <Smartphone size={16} />
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
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2">
          {status === "connected" && (
            <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium">Conectado</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleNewConnection}
          >
            <Smartphone size={14} />
            Novo número
          </Button>
          
          {status === "connected" && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950 flex items-center gap-1"
              onClick={handleDisconnect}
            >
              <LogOut size={14} />
              Desconectar
            </Button>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-4 border-b overflow-x-auto">
          <TabsList className="h-auto p-0 bg-transparent w-full justify-start">
            <TabsTrigger value="conversations" className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <MessageSquare className="mr-2 h-4 w-4" />
              Conversas
            </TabsTrigger>
            
            <TabsTrigger value="contacts" className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <Users className="mr-2 h-4 w-4" />
              Contatos
            </TabsTrigger>
            
            <TabsTrigger value="lists" className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <ListOrdered className="mr-2 h-4 w-4" />
              Listas
            </TabsTrigger>
            
            <TabsTrigger value="broadcasts" className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <Send className="mr-2 h-4 w-4" />
              Broadcast
            </TabsTrigger>
            
            <TabsTrigger value="schedules" className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <Calendar className="mr-2 h-4 w-4" />
              Agendamentos
            </TabsTrigger>
            
            <TabsTrigger value="media" className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <FileImage className="mr-2 h-4 w-4" />
              Mídia
            </TabsTrigger>
            
            <TabsTrigger value="automations" className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <Zap className="mr-2 h-4 w-4" />
              Automações
            </TabsTrigger>
            
            <TabsTrigger value="settings" className="py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>
        </div>
        
        {renderContent()}
      </Tabs>
      
      <QRCodeModal
        open={showQrModal}
        onOpenChange={setShowQrModal}
        sessionId="novo-numero"
        onLogin={handleLogin}
      />
    </div>
  );
};

export default WhatsAppMenuLayout;
