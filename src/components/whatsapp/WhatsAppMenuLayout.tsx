
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
import { useToast } from "@/hooks/use-toast";
import WhatsAppConversations from "./WhatsAppConversations";
import ContactsManager from "./contacts/ContactsManager";
import ListsManager from "./lists/ListsManager";
import BroadcastManager from "./broadcasts/BroadcastManager";
import MediaManager from "./media/MediaManager";
import ScheduleManager from "./schedules/ScheduleManager";
import WhatsAppConfig from "./config/WhatsAppConfig";
import AutomationsManager from "./automations/AutomationsManager";
import { WhatsAppConnectionStatus } from "@/hooks/useQRCode";

interface WhatsAppMenuLayoutProps {
  sessionId: string;
  status?: WhatsAppConnectionStatus;
  onLogout?: () => void;
}

const WhatsAppMenuLayout = ({
  sessionId,
  status = "not_started",
  onLogout
}: WhatsAppMenuLayoutProps) => {
  const [activeTab, setActiveTab] = useState("conversations");
  const { toast } = useToast();

  if (!sessionId) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
        <p>Aguardando seleção de sessão...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full">
      <div className="bg-muted p-2 border-b sticky top-0 z-10">
        <ScrollArea className="w-full">
          <div className="min-w-max">
            <TabsList className="w-full min-w-max flex">
              <TabsTrigger value="conversations" onClick={() => setActiveTab("conversations")}>
                <MessageSquare size={16} className="mr-1" /> Conversas
              </TabsTrigger>
              <TabsTrigger value="contacts" onClick={() => setActiveTab("contacts")}>
                <Users size={16} className="mr-1" /> Contatos
              </TabsTrigger>
              <TabsTrigger value="lists" onClick={() => setActiveTab("lists")}>
                <ListOrdered size={16} className="mr-1" /> Listas
              </TabsTrigger>
              <TabsTrigger value="broadcasts" onClick={() => setActiveTab("broadcasts")}>
                <Send size={16} className="mr-1" /> Broadcast
              </TabsTrigger>
              <TabsTrigger value="schedules" onClick={() => setActiveTab("schedules")}>
                <Calendar size={16} className="mr-1" /> Agendamentos
              </TabsTrigger>
              <TabsTrigger value="media" onClick={() => setActiveTab("media")}>
                <FileImage size={16} className="mr-1" /> Mídia
              </TabsTrigger>
              <TabsTrigger value="automations" onClick={() => setActiveTab("automations")}>
                <Zap size={16} className="mr-1" /> Automações
              </TabsTrigger>
              <TabsTrigger value="settings" onClick={() => setActiveTab("settings")}>
                <Settings size={16} className="mr-1" /> Config
              </TabsTrigger>
            </TabsList>
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsContent value="conversations" className="m-0 p-0 h-full">
            <WhatsAppConversations sessionId={sessionId} />
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

      {status === "connected" && onLogout && (
        <div className="flex justify-end p-2 bg-muted border-t">
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut size={14} className="mr-2" /> Desconectar
          </Button>
        </div>
      )}
    </div>
  );
};

export default WhatsAppMenuLayout;
