
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
  return <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between mb-4", className)}>
      <div className="flex items-center mb-2 sm:mb-0">
        <h2 className="text-xl font-semibold">{title}</h2>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-2">
                  <HelpCircle size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {description && <p className="text-sm text-muted-foreground ml-2">{description}</p>}
      </div>
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
