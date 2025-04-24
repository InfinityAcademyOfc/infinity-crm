
import React from "react";
import { Pencil } from "lucide-react";

interface NodeEditButtonProps {
  onEdit?: () => void;
}

const NodeEditButton: React.FC<NodeEditButtonProps> = ({ onEdit }) => (
  <button
    title="Editar Nó"
    type="button"
    className="inline-flex items-center justify-center rounded-full bg-white shadow-md border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary h-6 w-6"
    onClick={(e) => {
      e.stopPropagation();
      if (onEdit) onEdit();
    }}
  >
    <Pencil size={14} className="text-primary" />
  </button>
);

export default NodeEditButton;
