
import { VariantProps } from "class-variance-authority";
import { sidebarMenuButtonVariants } from "./variants";

export type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof import("@radix-ui/react-tooltip").TooltipContent>
  variant?: VariantProps<typeof sidebarMenuButtonVariants>["variant"]
  size?: VariantProps<typeof sidebarMenuButtonVariants>["size"]
}
