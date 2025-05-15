
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
        "h-10 w-10 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-transform hover:scale-105",
        className
      )}
      title={title || (isCollapsed ? "Expandir" : "Recolher")}
      onClick={onClick}
    >
      {isCollapsed ? 
        (position === "right" ? <ChevronRight size={16} /> : <ChevronLeft size={16} />) : 
        (position === "right" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />)
      }
    </Button>
  );
};

export default CollapseButton;
