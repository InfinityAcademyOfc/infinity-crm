import React, { ReactNode } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
interface SectionHeaderProps {
  title: string;
  description?: string;
  tooltip?: string;
  actions?: ReactNode;
  className?: string;
}
export function SectionHeader({
  title,
  description,
  tooltip,
  actions,
  className
}: SectionHeaderProps) {
  return <div className={cn("mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4", className)}>
      
      
      {actions && <div className="flex flex-wrap items-center gap-2 animate-fade-in">
          {actions}
        </div>}
    </div>;
}
interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "secondary";
}
export function ActionButton({
  icon,
  label,
  onClick,
  variant = "default"
}: ActionButtonProps) {
  return <Button variant={variant} onClick={onClick} className="gap-2 whitespace-nowrap">
      {icon}
      {label}
    </Button>;
}