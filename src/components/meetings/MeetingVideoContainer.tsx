
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Maximize, Minimize } from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  participants: any[];
}

interface MeetingVideoContainerProps {
  meeting: Meeting;
  onLeave: () => void;
}

const MeetingVideoContainer = ({ meeting, onLeave }: MeetingVideoContainerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  
  // Generate a random meeting ID for Jitsi
  const roomName = meeting.id || `meeting-${Math.random().toString(36).substring(2, 9)}`;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;

    script.onload = () => {
      if (iframeRef.current && typeof window.JitsiMeetExternalAPI === 'function') {
        const domain = "meet.jit.si";
        const options = {
          roomName,
          width: "100%",
          height: "100%",
          parentNode: iframeRef.current,
          interfaceConfigOverwrite: {
            filmStripOnly: false,
          },
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);
        api.executeCommand("displayName", "Usuário");
      }
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [roomName]);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current || isFullScreen) return;
    
    setIsDragging(true);
    
    const rect = containerRef.current.getBoundingClientRect();
    setDragOffsetX(e.clientX - rect.left);
    setDragOffsetY(e.clientY - rect.top);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const x = e.clientX - dragOffsetX;
    const y = e.clientY - dragOffsetY;
    
    // Ensure the element stays within viewport bounds
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    const maxX = window.innerWidth - containerWidth;
    const maxY = window.innerHeight - containerHeight;
    
    containerRef.current.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
    containerRef.current.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
  };

  // Toggle fullscreen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (containerRef.current) {
      // Reset position when toggling fullscreen
      if (isFullScreen) {
        containerRef.current.style.left = '50%';
        containerRef.current.style.top = '50%';
        containerRef.current.style.transform = 'translate(-50%, -50%)';
      } else {
        containerRef.current.style.left = '0';
        containerRef.current.style.top = '0';
        containerRef.current.style.transform = 'none';
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col ${isFullScreen ? 'fixed inset-0 z-50' : 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] z-40'}`}
      style={{
        backgroundColor: "#1a1a1a",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
        borderRadius: isFullScreen ? "0" : "8px",
        overflow: "hidden",
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div 
        className="flex items-center justify-between p-2 bg-gray-900 cursor-grab"
        onMouseDown={handleMouseDown}
      >
        <h2 className="text-white font-medium px-2 truncate">
          {meeting.title} - {meeting.date} {meeting.time}
        </h2>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-800"
            onClick={toggleFullScreen}
          >
            {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </Button>
          <Button
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-gray-800"
            onClick={onLeave}
          >
            <X size={18} />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto relative bg-black">
        <div ref={iframeRef} className="w-full h-full" />
      </div>
    </div>
  );
};

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default MeetingVideoContainer;
