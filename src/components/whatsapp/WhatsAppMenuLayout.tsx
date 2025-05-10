// src/components/whatsapp/WhatsAppMenuLayout.tsx
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare, Users, Settings, Send, FileImage,
  Calendar, ListOrdered, Zap, AlertCircle,
  Smartphone, LogOut
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

interface Props {
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
}: Props) => {
  const [activeTab, setActiveTab] = useState("conversations");
  const [showQrModal, setShowQrModal] = useState(false);
  const { toast } = useToast();

  const handleDeleteSession = async () => {
    if (!confirm("Apagar esta sessão permanentemente?")) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await fetch(`${apiUrl}/sessions/${sessionId}`, { method: "DELETE" });
      location.reload();
    } catch {
      toast({ title: "Erro", description: "Erro ao apagar sessão.", variant: "destructive" });
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          {status === "connected" && (
            <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-600 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Conectado</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowQrModal(true)}>
            <Smartphone size={14} /> Novo número
          </Button>
          {status === "connected" && (
            <>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut size={14} /> Desconectar
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteSession}>
                <Trash size={14} /> Apagar sessão
              </Button>
            </>
          )}
        </div>
      </div>

      {status !== "connected" && (
        <Alert variant="default" className="mb-4 bg-yellow-50 dark:bg-yellow-900/20">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            Aguardando conexão. Escaneie o QR Code para ativar.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-2 border-b overflow-x-auto">
          <TabsList className="w-full">
            <TabsTrigger value="conversations"><MessageSquare size={16} /> Conversas</TabsTrigger>
            <TabsTrigger value="contacts"><Users size={16} /> Contatos</TabsTrigger>
            <TabsTrigger value="lists"><ListOrdered size={16} /> Listas</TabsTrigger>
            <TabsTrigger value="broadcasts"><Send size={16} /> Broadcast</TabsTrigger>
            <TabsTrigger value="schedules"><Calendar size={16} /> Agendamentos</TabsTrigger>
            <TabsTrigger value="media"><FileImage size={16} /> Mídia</TabsTrigger>
            <TabsTrigger value="automations"><Zap size={16} /> Automações</TabsTrigger>
            <TabsTrigger value="settings"><Settings size={16} /> Configurações</TabsTrigger>
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
        sessionId={sessionId}
        onLogin={() => toast({ title: "Sessão ativa", description: "Número conectado!" })}
      />
    </div>
  );
};

export default WhatsAppMenuLayout;
