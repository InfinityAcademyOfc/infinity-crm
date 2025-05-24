
import React, { useState } from "react";
import { MessageSquare, X, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ChatFullScreenDialog from "./ChatFullScreenDialog";
import FloatingPanel from "./FloatingPanel";
import { useFloatingAction } from "@/hooks/use-floating-action";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { useProductionWorkspace } from "@/hooks/useProductionWorkspace";

interface UnifiedFloatingActionProps {
  defaultOpen?: boolean;
}

const UnifiedFloatingAction = ({ defaultOpen = false }: UnifiedFloatingActionProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { projects } = useProductionWorkspace();
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

  // Count active projects
  const activeProjectsCount = projects.filter(p => p.status === 'in_progress').length;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2">
      {/* Quick stats when closed */}
      {!isOpen && (
        <div className="flex flex-col gap-2">
          {activeProjectsCount > 0 && (
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {activeProjectsCount} projeto{activeProjectsCount !== 1 ? 's' : ''} ativo{activeProjectsCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

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
        className={`rounded-full ${buttonSize} shadow-lg ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'} relative`}
      >
        {isOpen ? <X size={iconSize} /> : <MessageSquare size={iconSize} />}
        
        {/* Notification badge */}
        {!isOpen && activeProjectsCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {activeProjectsCount > 9 ? '9+' : activeProjectsCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};

export default UnifiedFloatingAction;
