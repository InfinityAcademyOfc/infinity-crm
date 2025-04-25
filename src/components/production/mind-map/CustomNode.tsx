
import React, { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { Pencil } from "lucide-react";
import NodeEditButton from "./NodeEditButton";

interface CustomNodeProps {
  data: {
    label: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    shape?: string;
    link?: string;
    isEditing?: boolean;
    onLabelChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onEditDone?: () => void;
    onStartEdit?: () => void;
    onEdit?: () => void;
    onResize?: (width: number, height: number) => void;
  };
  isConnectable: boolean;
  selected?: boolean;
}

const CustomNode = ({ data, isConnectable, selected }: CustomNodeProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [size, setSize] = useState({ width: 120, height: 60 });
  const startPosition = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });
  
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    startPosition.current = { x: e.clientX, y: e.clientY };
    if (nodeRef.current) {
      startSize.current = { 
        width: nodeRef.current.offsetWidth, 
        height: nodeRef.current.offsetHeight 
      };
    }
    
    // Add global event listeners
    window.addEventListener('mousemove', handleResize);
    window.addEventListener('mouseup', handleResizeEnd);
  };
  
  const handleResize = (e: MouseEvent) => {
    if (isResizing) {
      const dx = e.clientX - startPosition.current.x;
      const dy = e.clientY - startPosition.current.y;
      
      const newWidth = Math.max(80, startSize.current.width + dx);
      const newHeight = Math.max(40, startSize.current.height + dy);
      
      setSize({ width: newWidth, height: newHeight });
      
      if (data.onResize) {
        data.onResize(newWidth, newHeight);
      }
    }
  };
  
  const handleResizeEnd = () => {
    setIsResizing(false);
    window.removeEventListener('mousemove', handleResize);
    window.removeEventListener('mouseup', handleResizeEnd);
  };
  
  // Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing]);

  return (
    <div
      ref={nodeRef}
      className={`custom-node px-4 py-2 shadow-md transition-colors relative group ${selected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        backgroundColor: data.backgroundColor || '#8B5CF6',
        color: data.textColor || '#ffffff',
        borderColor: data.borderColor || '#6D28D9',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderRadius: data.shape === 'roundedRect' ? '8px' :
                      data.shape === 'circle' || data.shape === 'ellipse' ? '50%' :
                      data.shape === 'notepad' ? '8px' :
                      data.shape === 'highlight' ? '4px' :
                      data.shape === 'diamond' ? '0px' : // default
                      '0px',
        transform: data.shape === 'diamond' ? 'rotate(45deg)' : 'none',
        cursor: 'move',
        width: `${size.width}px`,
        height: `${size.height}px`,
        minWidth: '80px',
        minHeight: '40px',
        userSelect: 'none',
      }}
    >
      {/* Resize handle */}
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-10 hover:bg-blue-500/20 rounded-bl"
        onMouseDown={handleResizeStart}
      />

      {/* Edit button */}
      <div className="absolute top-1 right-1 z-10 opacity-80 group-hover:opacity-100">
        <NodeEditButton onEdit={data.onEdit} />
      </div>

      {/* Handles for connections */}
      <Handle
        type="source"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
      <Handle
        type="target"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
      <Handle
        type="source"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-2 h-2"
      />

      {/* Label with editable content */}
      <div style={{
        transform: data.shape === 'diamond' ? 'rotate(-45deg)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%'
      }}>
        {data.isEditing ? (
          <input
            type="text"
            value={data.label}
            autoFocus
            onChange={data.onLabelChange}
            onBlur={data.onEditDone}
            className="bg-transparent outline-none border-none w-full text-center text-xs"
            style={{ color: data.textColor || "#fff" }}
          />
        ) : (
          <span
            onDoubleClick={data.onStartEdit}
            className="cursor-text select-text w-full text-xs text-center"
            style={{ background: "transparent", minWidth: 40 }}
          >
            {data.label}
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(CustomNode);
