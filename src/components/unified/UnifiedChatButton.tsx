
import React, { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

export interface ChatFullScreenDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatFullScreenDialog: React.FC<ChatFullScreenDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold">Chat</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={24} />
        </Button>
      </div>
      <div className="flex-1 p-4">
        <p>Conteúdo do chat em tela cheia</p>
      </div>
    </div>
  );
};

interface UnifiedChatButtonProps {
  defaultOpen?: boolean;
}

const UnifiedChatButton = ({ defaultOpen = false }: UnifiedChatButtonProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile ? useIsMobile() : false;
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      toast({
        title: "Chat aberto",
        description: "Você pode conversar com sua equipe agora."
      });
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const buttonSize = isMobile ? "h-9 w-9" : "h-12 w-12";
  const iconSize = isMobile ? 18 : 24;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      <ChatFullScreenDialog
        isOpen={isFullScreen}
        onClose={() => toggleFullScreen()}
      />
      
      <Button
        size="icon"
        onClick={toggleOpen}
        className={`rounded-full ${buttonSize} shadow-lg ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
      >
        {isOpen ? <X size={iconSize} /> : <MessageSquare size={iconSize} />}
      </Button>
    </div>
  );
};

export default UnifiedChatButton;
