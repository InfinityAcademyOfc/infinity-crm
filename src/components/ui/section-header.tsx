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
  return <div className="">
      
      {actions && <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">{actions}</div>}
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