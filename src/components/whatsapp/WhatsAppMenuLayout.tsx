
import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  MessageSquare,
  Users,
  Bot,
  Settings,
  LogOut,
  AlertCircle,
} from "lucide-react";
import WhatsAppConversations from "./WhatsAppConversations";
import ContactsManager from "./contacts/ContactsManager";
import ChatbotManager from "./chatbot/ChatbotManager";
import SettingsPanel from "./SettingsPanel";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const tabItems = [
  { id: "conversations", label: "Conversas", icon: MessageSquare },
  { id: "contacts", label: "Contatos", icon: Users },
  { id: "chatbot", label: "Chatbot", icon: Bot },
  { id: "settings", label: "Configurações", icon: Settings },
];

export default function WhatsAppMenuLayout() {
  const [activeTab, setActiveTab] = useState("conversations");
  const { disconnect, sessionId, connectionStatus } = useWhatsApp();

  const handleLogout = async () => {
    try {
      await disconnect();
      toast.success("Sessão encerrada com sucesso.");
    } catch (error) {
      toast.error("Erro ao encerrar sessão.");
    }
  };

  const isConnected = connectionStatus === "connected";

  return (
    <div className="h-full flex flex-col">
      {!isConnected && (
        <Alert className="mb-4 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle>WhatsApp não conectado</AlertTitle>
          <AlertDescription>
            Escaneie o código QR para conectar seu WhatsApp antes de usar este módulo.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="border-b flex space-x-2 p-2">
          {tabItems.map((item) => (
            <TabsTrigger key={item.id} value={item.id} className="flex items-center gap-2">
              <item.icon className="w-4 h-4" />
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="conversations" className="m-0 p-0 h-full">
          <WhatsAppConversations />
        </TabsContent>
        
        <TabsContent value="contacts" className="m-0 p-0 h-full">
          <ContactsManager sessionId={sessionId || ""} />
        </TabsContent>
        
        <TabsContent value="chatbot" className="m-0 p-0 h-full">
          <ChatbotManager sessionId={sessionId || ""} />
        </TabsContent>
        
        <TabsContent value="settings" className="m-0 p-0 h-full">
          <SettingsPanel />
        </TabsContent>
      </Tabs>

      <div className="border-t p-4 flex justify-end">
        <button
          onClick={handleLogout}
          className="flex items-center text-sm text-red-600 hover:underline"
          disabled={!isConnected}
        >
          <LogOut className="w-4 h-4 mr-1" />
          Desconectar
        </button>
      </div>
    </div>
  );
}
