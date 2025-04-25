
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CollapseButtonProps {
  isCollapsed: boolean;
  onClick: () => void;
  className?: string;
  position?: "left" | "right";
  title?: string;
}

const CollapseButton: React.FC<CollapseButtonProps> = ({
  isCollapsed,
  onClick,
  className,
  position = "right",
  title,
}) => {
  return (
    <Button
      size="icon"
      variant="default"
      className={cn(
        "flex items-center justify-center rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95", 
        className
      )}
      title={title || (isCollapsed ? "Expandir" : "Recolher")}
      onClick={onClick}
    >
      {isCollapsed ? 
        (position === "right" ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />) : 
        (position === "right" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)
      }
    </Button>
  );
};

export default CollapseButton;
