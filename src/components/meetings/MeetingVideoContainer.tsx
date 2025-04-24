
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2 } from "lucide-react";
import VideoCall from "@/components/chat/VideoCall";
import { cn } from "@/lib/utils";

interface MeetingVideoContainerProps {
  meeting: {
    id: string;
    title: string;
    participants: number | { name: string; avatar?: string }[];
  };
  onLeave: () => void;
}

const MeetingVideoContainer = ({ meeting, onLeave }: MeetingVideoContainerProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Container size state for resizing
  const [containerSize, setContainerSize] = useState({ width: '100%', height: '85vh' });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      // Saving current size before maximizing
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ 
          width: `${width}px`, 
          height: `${height}px` 
        });
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return; // Don't allow resizing when maximized
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerSize({
        width: `${width + deltaX}px`,
        height: `${height + deltaY}px`
      });
    }
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex flex-col rounded-lg overflow-hidden transition-all duration-300 bg-card shadow-lg border",
        isMaximized ? "fixed inset-0 z-50" : "relative"
      )}
      style={!isMaximized ? containerSize : undefined}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onLeave}
            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
          >
            <X size={16} />
          </Button>
          <h2 className="text-xl font-bold">{meeting.title}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
            {typeof meeting.participants === 'number' 
              ? `${meeting.participants} participantes` 
              : `${meeting.participants.length} participantes`}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMaximize}
            className="h-8 w-8"
          >
            {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden bg-black">
        <VideoCall 
          isOpen={true} 
          onClose={onLeave}
          onEndCall={onLeave}
        />
      </div>
      
      {!isMaximized && (
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize"
          onMouseDown={handleMouseDown}
        />
      )}
    </div>
  );
};

export default MeetingVideoContainer;
