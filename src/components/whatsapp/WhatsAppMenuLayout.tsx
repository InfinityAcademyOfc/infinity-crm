import React, { useState, useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, Bot, Settings, LogOut } from "lucide-react";
import WhatsAppConversations from "./WhatsAppConversations";
import ContactsManager from "./ContactsManager";
import ChatbotManager from "./ChatbotManager";
import SettingsPanel from "./SettingsPanel";
import { WhatsAppContext } from "@/contexts/WhatsAppContext";
import { toast } from "sonner";

const tabItems = [
  { id: "conversations", label: "Conversas", icon: MessageSquare },
  { id: "contacts", label: "Contatos", icon: Users },
  { id: "chatbot", label: "Chatbot", icon: Bot },
  { id: "settings", label: "Configurações", icon: Settings },
];

export default function WhatsAppMenuLayout() {
  const [activeTab, setActiveTab] = useState("conversations");
  const { logout, sessionId } = useContext(WhatsAppContext);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sessão encerrada com sucesso.");
    } catch (error) {
      toast.error("Erro ao encerrar sessão.");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="border-b flex space-x-2 p-2">
          {tabItems.map((item) => (
            <TabsTrigger key={item.id} value={item.id} className="flex items-center gap-2">
              <item.icon className="w-4 h-4" />
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabItems.map((item) => (
          <TabsContent key={item.id} value={item.id} className="m-0 p-0 h-full">
            {item.id === "conversations" && <WhatsAppConversations />}
            {item.id === "contacts" && <ContactsManager sessionId={sessionId} />}
            {item.id === "chatbot" && <ChatbotManager sessionId={sessionId} />}
            {item.id === "settings" && <SettingsPanel />}
          </TabsContent>
        ))}
      </Tabs>

      <div className="border-t p-4 flex justify-end">
        <button
          onClick={handleLogout}
          className="flex items-center text-sm text-red-600 hover:underline"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Desconectar
        </button>
      </div>
    </div>
  );
}

