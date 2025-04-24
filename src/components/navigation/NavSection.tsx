
import React from "react";
import { cn } from "@/lib/utils";
import NavItem from "./NavItem";

interface NavItemData {
  icon: React.ReactNode;
  label: string;
  to: string;
  end?: boolean;
}

interface NavSectionProps {
  title: string;
  items: NavItemData[];
  isCollapsed: boolean;
  onItemClick?: () => void;
  className?: string;
}

const NavSection = ({ title, items, isCollapsed, onItemClick, className }: NavSectionProps) => (
  <div className={className}>
    <p className={cn("text-xs font-semibold text-muted-foreground mb-2 px-4 uppercase transition-opacity",
                  isCollapsed ? "opacity-0 h-0 mb-0 overflow-hidden" : "opacity-100")}>
      {title}
    </p>
    <nav className="space-y-1">
      {items.map((item, index) => (
        <NavItem 
          key={`${item.to}-${index}`} 
          icon={item.icon} 
          label={item.label} 
          to={item.to} 
          end={item.end} 
          collapsed={isCollapsed} 
          onClick={onItemClick}
        />
      ))}
    </nav>
  </div>
);

export default NavSection;
