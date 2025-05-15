
import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"

// Export from menubar-content.tsx
export {
  MenubarContent,
  MenubarSubContent,
  MenubarSubTrigger,
} from "./menubar/menubar-content";

// Export from menubar-item.tsx
export { 
  MenubarItem,
  MenubarCheckboxItem
} from "./menubar/menubar-item";

// Export from menubar-radio.tsx
export { 
  MenubarRadioItem,
  MenubarRadioGroup
} from "./menubar/menubar-radio";

// Define the Menubar component
const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={className}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

// Define the MenubarTrigger component
const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={className}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

// Define the MenubarShortcut component
const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={className}
      {...props}
    />
  )
}
MenubarShortcut.displayName = "MenubarShortcut"

// Export components defined in this file
export {
  Menubar,
  MenubarTrigger,
  MenubarShortcut
}
