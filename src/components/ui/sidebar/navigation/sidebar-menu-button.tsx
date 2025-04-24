
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { sidebarMenuButtonVariants } from "../variants"
import type { SidebarMenuButtonProps } from "../types"

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, asChild, isActive, tooltip, variant, size, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  const content = (
    <Comp
      ref={ref}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size, className }))}
      {...props}
    />
  )

  if (tooltip) {
    return (
      <TooltipPrimitive.Provider delayDuration={0}>
        <TooltipPrimitive.Root>
          <TooltipPrimitive.Trigger asChild>{content}</TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              {...(typeof tooltip === "string"
                ? { content: tooltip }
                : tooltip)}
              className={cn(
                "z-50 overflow-hidden rounded-md bg-sidebar-tooltip px-3 py-1.5 text-xs text-sidebar-tooltip-foreground animate-in fade-in-0 zoom-in-95",
                "data-[side=bottom]:slide-in-from-top-2",
                "data-[side=left]:slide-in-from-right-2",
                "data-[side=right]:slide-in-from-left-2",
                "data-[side=top]:slide-in-from-bottom-2"
              )}
            />
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    )
  }

  return content
})
SidebarMenuButton.displayName = "SidebarMenuButton"
