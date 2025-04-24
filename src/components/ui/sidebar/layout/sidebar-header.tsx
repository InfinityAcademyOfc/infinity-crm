
import * as React from "react"
import { cn } from "@/lib/utils"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-14 items-center px-3", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"
