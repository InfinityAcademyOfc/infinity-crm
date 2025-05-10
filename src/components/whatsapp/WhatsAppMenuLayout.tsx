
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
  LogOut,
  Trash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import WhatsAppConversations from "./WhatsAppConversations";
import ContactsManager from "./contacts/ContactsManager";
import ListsManager from "./lists/ListsManager";
import BroadcastManager from "./broadcasts/BroadcastManager";
import MediaManager from "./media/MediaManager";
import ScheduleManager from "./schedules/ScheduleManager";
import WhatsAppConfig from "./config/WhatsAppConfig";
import AutomationsManager from "./automations/AutomationsManager";
import QRCodeModal from "./QRCodeModal";
import { WhatsAppConnectionStatus } from "@/hooks/useQRCode";

interface WhatsAppMenuLayoutProps {
  sessionId?: string;
  status?: WhatsAppConnectionStatus;
  onShowQrCode?: () => void;
  onLogout?: () => void;
}

const WhatsAppMenuLayout = ({ 
  sessionId = "teste",
  status = "not_started",
  onShowQrCode,
  onLogout
}: WhatsAppMenuLayoutProps) => {
  const [activeTab, setActiveTab] = useState("conversations");
  const [showQrModal, setShowQrModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log("📡 Status recebido no MenuLayout:", status);
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

  const handleDeleteSession = async () => {
    const confirm = window.confirm("Deseja realmente apagar esta sessão do WhatsApp?");
    if (!confirm) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/sessions/${sessionId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error("Erro ao apagar sessão");

      toast({
        title: "Sessão apagada",
        description: "Todos os dados foram removidos com sucesso.",
        variant: "default"
      });

      // Você pode forçar uma atualização do status ou redirecionar
      location.reload(); // ou setStatus("not_started")
    } catch (err) {
      toast({
        title: "Erro ao apagar",
        description: "Não foi possível apagar a sessão.",
        variant: "destructive"
      });
      console.error("Erro ao apagar sessão:", err);
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
            <Smartphone size={14} /> Novo número
          </Button>

          {status === "connected" && (
            <Button variant="outline" size="sm" onClick={handleDisconnect}>
              <LogOut size={14} /> Desconectar
            </Button>
          )}
        </div>
      </div>

      {/* Alert notification when not connected */}
      {status !== "connected" && (
        <Alert variant="default" className="mb-4 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
          <AlertDescription className="text-yellow-700 dark:text-yellow-400">
            Aguardando conexão com o WhatsApp. Escaneie o QR Code ou reconecte o número.
          </AlertDescription>
        </Alert>
      )}

      {/* Always render tabs - regardless of connection status */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-4 border-b overflow-x-auto">
          <TabsList className="h-auto p-0 bg-transparent w-full justify-start">
            <TabsTrigger value="conversations" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <MessageSquare className="mr-2 h-4 w-4" /> Conversas
            </TabsTrigger>
            <TabsTrigger value="contacts" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Users className="mr-2 h-4 w-4" /> Contatos
            </TabsTrigger>
            <TabsTrigger value="lists" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <ListOrdered className="mr-2 h-4 w-4" /> Listas
            </TabsTrigger>
            <TabsTrigger value="broadcasts" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Send className="mr-2 h-4 w-4" /> Broadcast
            </TabsTrigger>
            <TabsTrigger value="schedules" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Calendar className="mr-2 h-4 w-4" /> Agendamentos
            </TabsTrigger>
            <TabsTrigger value="media" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <FileImage className="mr-2 h-4 w-4" /> Mídia
            </TabsTrigger>
            <TabsTrigger value="automations" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Zap className="mr-2 h-4 w-4" /> Automações
            </TabsTrigger>
            <TabsTrigger value="settings" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Settings className="mr-2 h-4 w-4" /> Configurações
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="conversations"><WhatsAppConversations sessionId={sessionId} /></TabsContent>
        <TabsContent value="contacts"><ContactsManager /></TabsContent>
        <TabsContent value="lists"><ListsManager /></TabsContent>
        <TabsContent value="broadcasts"><BroadcastManager /></TabsContent>
        <TabsContent value="schedules"><ScheduleManager /></TabsContent>
        <TabsContent value="media"><MediaManager /></TabsContent>
        <TabsContent value="automations"><AutomationsManager /></TabsContent>
        <TabsContent value="settings"><WhatsAppConfig /></TabsContent>
      </Tabs>

      <QRCodeModal
        open={showQrModal}
        onOpenChange={setShowQrModal}
        sessionId={sessionId || "novo-numero"}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default WhatsAppMenuLayout;
