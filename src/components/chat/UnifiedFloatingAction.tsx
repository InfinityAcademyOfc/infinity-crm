
import React, { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ChatFullScreenDialog from "./ChatFullScreenDialog";
import FloatingPanel from "./FloatingPanel";
import { useFloatingAction } from "@/hooks/use-floating-action";
import { useIsMobile } from "@/hooks/use-mobile";

interface UnifiedFloatingActionProps {
  defaultOpen?: boolean;
}

const UnifiedFloatingAction = ({ defaultOpen = false }: UnifiedFloatingActionProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const {
    isOpen,
    isFullScreen,
    activeTab,
    chatHeight,
    chatWidth,
    isResizing,
    setActiveTab,
    toggleOpen,
    toggleFullScreen,
    handleResizing
  } = useFloatingAction({ defaultOpen });

  const buttonSize = isMobile ? "h-9 w-9" : "h-12 w-12";
  const iconSize = isMobile ? 18 : 24;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      <ChatFullScreenDialog
        isOpen={isFullScreen}
        onClose={() => toggleFullScreen()}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <FloatingPanel
        isOpen={isOpen && !isFullScreen}
        chatWidth={chatWidth}
        chatHeight={chatHeight}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onResize={handleResizing}
        onClose={toggleOpen}
        onFullScreen={toggleFullScreen}
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

export default UnifiedFloatingAction;
