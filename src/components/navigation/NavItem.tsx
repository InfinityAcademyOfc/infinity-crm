
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
        "sidebar-link",
        collapsed ? "justify-center px-2" : "px-4",
        isActive ? "active" : ""
      )
    }
    onClick={onClick}
  >
    <span className="text-current shrink-0">{icon}</span>
    {!collapsed && <span className="font-medium">{label}</span>}
  </NavLink>
);

export default NavItem;
