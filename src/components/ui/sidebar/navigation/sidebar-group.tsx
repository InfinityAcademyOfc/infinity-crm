
import * as React from "react"
import { cn } from "@/lib/utils"

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-4 first:pt-0 last:pb-0", className)}
    {...props}
  />
))
SidebarGroup.displayName = "SidebarGroup"
