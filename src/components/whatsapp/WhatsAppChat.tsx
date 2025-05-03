
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smartphone, MessageSquare } from "lucide-react";
import WhatsAppConversations from "./WhatsAppConversations";
import QRCodeScanner from "./QRCodeScanner";

// Default session ID - can be made dynamic in the future
const DEFAULT_SESSION_ID = "teste";

const WhatsAppChat = () => {
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [sessionId] = useState<string>(DEFAULT_SESSION_ID);

  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full">
          <TabsTrigger value="chat" className="flex-1">
            <MessageSquare className="mr-2 h-4 w-4" />
            Conversas
          </TabsTrigger>
          <TabsTrigger value="qrcode" className="flex-1">
            <Smartphone className="mr-2 h-4 w-4" />
            Conectar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 h-full p-0">
          <WhatsAppConversations sessionId={sessionId} />
        </TabsContent>

        <TabsContent value="qrcode" className="flex-1 h-full p-0">
          <QRCodeScanner sessionId={sessionId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhatsAppChat;
