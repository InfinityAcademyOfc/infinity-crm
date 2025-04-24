
import React from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ChatContent from "./ChatContent";
import WhatsAppChat from "../whatsapp/WhatsAppChat";

interface ChatFullScreenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const ChatFullScreenDialog = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
}: ChatFullScreenDialogProps) => {
  if (!isOpen) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[90vw] h-[80vh] p-0">
        <DialogHeader className="px-4 py-2 border-b">
          <DialogTitle>Comunicação</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full h-full">
          <div className="border-b px-4">
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="chat" className="h-[calc(100%-50px)] flex flex-col">
            <ChatContent />
          </TabsContent>
          <TabsContent value="whatsapp" className="h-[calc(100%-50px)]">
            <div className="h-full">
              <WhatsAppChat />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ChatFullScreenDialog;
