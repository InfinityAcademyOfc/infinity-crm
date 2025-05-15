
import * as React from "react"
import { cn } from "@/lib/utils"

export const SidebarRail = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center space-y-2 py-2", className)}
    {...props}
  />
))
SidebarRail.displayName = "SidebarRail"
