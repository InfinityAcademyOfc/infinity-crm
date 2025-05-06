
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { MobileNav } from "@/components/layout/MobileNav";
import Header from "@/components/navigation/Header";
import { useIsMobile } from "@/hooks/use-mobile";

interface TopNavProps {
  openSidebar?: () => void;
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
}

export function TopNav({ 
  openSidebar = () => {}, 
  isSidebarOpen = false,
  toggleSidebar = () => {}
}: TopNavProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <Header 
        openSidebar={openSidebar} 
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <MobileNav open={showMobileMenu} setOpen={setShowMobileMenu} />
    </>
  );
}
