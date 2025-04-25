
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  end?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, to, end = false, collapsed = false, onClick }: NavItemProps) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      cn(
        "sidebar-link relative flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200",
        collapsed ? "justify-center px-2" : "px-4",
        isActive 
          ? "bg-primary text-primary-foreground before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:rounded-full before:bg-primary-foreground before:opacity-50" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )
    }
    onClick={onClick}
  >
    <span className="shrink-0 transition-transform duration-200 ease-in-out group-hover:scale-110">
      {icon}
    </span>
    {!collapsed && (
      <span className="font-medium truncate">
        {label}
      </span>
    )}
  </NavLink>
);

export default NavItem;
