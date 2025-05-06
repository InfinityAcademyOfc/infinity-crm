
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
  Zap
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

interface WhatsAppMenuLayoutProps {
  sessionId?: string;
}

const WhatsAppMenuLayout = ({ sessionId = "teste" }: WhatsAppMenuLayoutProps) => {
  const [activeTab, setActiveTab] = useState("conversations");
  const { status } = useQRCode(sessionId);
  
  useEffect(() => {
    // Log status for debugging
    console.log("WhatsAppMenuLayout status:", status);
  }, [status]);

  const renderTabContent = () => {
    // Check if connected before rendering content
    if (status !== "connected") {
      return (
        <div className="flex items-center justify-center h-64 p-8 text-center">
          <p className="text-muted-foreground">
            Aguardando conexão com o WhatsApp para exibir o conteúdo...
          </p>
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-4 border-b">
          <TabsList className="h-auto p-0 bg-transparent overflow-x-auto w-full justify-start">
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
        
        {renderTabContent()}
      </Tabs>
    </div>
  );
};

export default WhatsAppMenuLayout;
