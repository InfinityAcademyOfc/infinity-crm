
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

const NavItem = ({
  icon,
  label,
  to,
  end = false,
  collapsed = false,
  onClick
}: NavItemProps) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      cn(
        "sidebar-link relative flex items-center gap-2 rounded-md transition-all duration-200",
        collapsed ? "justify-center px-2 py-2" : "px-4 py-2",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:rounded-full before:bg-primary-foreground before:opacity-60 hover:bg-primary/90"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )
    }
    onClick={onClick}
  >
    <span className="shrink-0 transition-transform duration-200 ease-in-out group-hover:scale-105">
      {icon}
    </span>
    {!collapsed && (
      <span className="truncate text-sm font-medium transition-opacity duration-200">
        {label}
      </span>
    )}
  </NavLink>
);

export default NavItem;
