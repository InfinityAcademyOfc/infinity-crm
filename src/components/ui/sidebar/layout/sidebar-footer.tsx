
import * as React from "react"
import { cn } from "@/lib/utils"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-3 py-4", className)} {...props} />
))
SidebarFooter.displayName = "SidebarFooter"
