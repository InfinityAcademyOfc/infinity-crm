
import * as React from "react"
import { cn } from "@/lib/utils"

export const SidebarGroupLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "px-3 text-xs font-medium text-sidebar-foreground/60 group-data-[collapsible=icon]:px-2",
      className
    )}
    {...props}
  />
))
SidebarGroupLabel.displayName = "SidebarGroupLabel"
