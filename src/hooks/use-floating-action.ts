
import { useState } from "react";

interface UseFloatingActionProps {
  defaultOpen?: boolean;
  defaultTab?: string;
}

export const useFloatingAction = ({
  defaultOpen = false,
  defaultTab = "chat"
}: UseFloatingActionProps = {}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [chatHeight, setChatHeight] = useState(500);
  const [chatWidth, setChatWidth] = useState(350);
  const [isResizing, setIsResizing] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (isFullScreen) {
      setIsFullScreen(false);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      setIsOpen(false);
    }
  };

  const setFloatingActionOpen = (open: boolean) => {
    setIsOpen(open);
    if (!open && isFullScreen) {
      setIsFullScreen(false);
    }
  };

  const handleResizing = () => {
    setIsResizing(true);
    setTimeout(() => {
      setIsResizing(false);
    }, 500);
  };

  return {
    isOpen,
    isFullScreen,
    activeTab,
    activePanel,
    chatHeight,
    chatWidth,
    isResizing,
    setActiveTab,
    setActivePanel,
    toggleOpen,
    toggleFullScreen,
    setFloatingActionOpen,
    handleResizing
  };
};
