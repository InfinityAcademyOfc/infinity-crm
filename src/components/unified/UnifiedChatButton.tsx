
import React, { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Properly define the props interface for ChatFullScreenDialog
interface ChatFullScreenDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Create the component with proper props
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
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      <ChatFullScreenDialog
        isOpen={isFullScreen}
        onClose={() => toggleFullScreen()}
      />
      
      <Button
        size="icon"
        onClick={toggleOpen}
        className="rounded-full h-12 w-12 shadow-lg bg-primary hover:bg-primary/90"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>
    </div>
  );
};

export default UnifiedChatButton;
