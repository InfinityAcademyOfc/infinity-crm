
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare, 
  Users, 
  Settings, 
  Send, 
  FileImage,
  Calendar, 
  ListOrdered, 
  Zap, 
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppConversations from "./WhatsAppConversations";
import ContactsManager from "./contacts/ContactsManager";
import ListsManager from "./lists/ListsManager";
import BroadcastManager from "./broadcasts/BroadcastManager";
import MediaManager from "./media/MediaManager";
import ScheduleManager from "./schedules/ScheduleManager";
import WhatsAppConfig from "./config/WhatsAppConfig";
import AutomationsManager from "./automations/AutomationsManager";
import { WhatsAppConnectionStatus } from "@/types/whatsapp";
import { useWhatsApp } from "@/contexts/WhatsAppContext";

interface WhatsAppMenuLayoutProps {
  sessionId: string;
  status?: WhatsAppConnectionStatus;
}

const WhatsAppMenuLayout = ({
  sessionId,
  status = "not_started",
}: WhatsAppMenuLayoutProps) => {
  const [activeTab, setActiveTab] = useState("conversations");
  const { disconnectSession } = useWhatsApp();

  if (!sessionId) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
        <p>Aguardando seleção de sessão...</p>
      </div>
    );
  }
  
  const handleLogout = () => {
    disconnectSession(sessionId);
  };

  const tabItems = [
    { id: "conversations", label: "Conversas", icon: <MessageSquare size={16} className="mr-1" /> },
    { id: "contacts", label: "Contatos", icon: <Users size={16} className="mr-1" /> },
    { id: "lists", label: "Listas", icon: <ListOrdered size={16} className="mr-1" /> },
    { id: "broadcasts", label: "Broadcast", icon: <Send size={16} className="mr-1" /> },
    { id: "schedules", label: "Agendamentos", icon: <Calendar size={16} className="mr-1" /> },
    { id: "media", label: "Mídia", icon: <FileImage size={16} className="mr-1" /> },
    { id: "automations", label: "Automações", icon: <Zap size={16} className="mr-1" /> },
    { id: "settings", label: "Config", icon: <Settings size={16} className="mr-1" /> }
  ];

  return (
    <div className="w-full flex flex-col h-full">
      <div className="bg-muted p-2 border-b sticky top-0 z-10">
        <ScrollArea className="w-full">
          <div className="min-w-max">
            <TabsList className="w-full min-w-max flex">
              {tabItems.map((item) => (
                <TabsTrigger 
                  key={item.id}
                  value={item.id} 
                  onClick={() => setActiveTab(item.id)}
                >
                  {item.icon} {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsContent value="conversations" className="m-0 p-0 h-full">
            <WhatsAppConversations />
          </TabsContent>
          
          <TabsContent value="contacts" className="m-0 p-0 h-full">
            <ContactsManager sessionId={sessionId} />
          </TabsContent>
          
          <TabsContent value="lists" className="m-0 p-0 h-full">
            <ListsManager sessionId={sessionId} />
          </TabsContent>
          
          <TabsContent value="broadcasts" className="m-0 p-0 h-full">
            <BroadcastManager sessionId={sessionId} />
          </TabsContent>
          
          <TabsContent value="schedules" className="m-0 p-0 h-full">
            <ScheduleManager sessionId={sessionId} />
          </TabsContent>
          
          <TabsContent value="media" className="m-0 p-0 h-full">
            <MediaManager sessionId={sessionId} />
          </TabsContent>
          
          <TabsContent value="automations" className="m-0 p-0 h-full">
            <AutomationsManager sessionId={sessionId} />
          </TabsContent>
          
          <TabsContent value="settings" className="m-0 p-0 h-full">
            <WhatsAppConfig sessionId={sessionId} />
          </TabsContent>
        </Tabs>
      </div>

      {status === "connected" && (
        <div className="flex justify-end p-2 bg-muted border-t">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut size={14} className="mr-2" /> Desconectar
          </Button>
        </div>
      )}
    </div>
  );
};

export default WhatsAppMenuLayout;
