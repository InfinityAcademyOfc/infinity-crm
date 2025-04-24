
import React, { ReactNode } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4", className)}>
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
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
  variant = "default",
}: ActionButtonProps) {
  return (
    <Button variant={variant} onClick={onClick} className="gap-2 whitespace-nowrap">
      {icon}
      {label}
    </Button>
  );
}
