import React, { memo } from 'react';
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
  };
  isConnectable: boolean;
  selected?: boolean;
}

const CustomNode = ({ data, isConnectable, selected }: CustomNodeProps) => {
  const handleClick = () => {
    // Clique permite escrever se não tem link nem está "edit button"
  };

  return (
    <div
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
                      data.shape === 'diamond' ? '0px' : // default
                      '0px',
        transform: data.shape === 'diamond' ? 'rotate(45deg)' : 'none',
        cursor: 'move',
        minWidth: 80,
        minHeight: 40
      }}
      onClick={handleClick}
    >
      {/* Botão de edição no canto superior direito */}
      <div className="absolute top-1 right-1 z-10 opacity-80 group-hover:opacity-100">
        <NodeEditButton onEdit={data.onEdit} />
      </div>

      {/* Handles padrão */}
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

      {/* Label com edição inline: */}
      <div style={{
        transform: data.shape === 'diamond' ? 'rotate(-45deg)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 32
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
            className="cursor-text select-text w-full text-xs"
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
