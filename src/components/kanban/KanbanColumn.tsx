
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface KanbanColumnProps {
  title: string;
  color?: string;
  children: ReactNode;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  modern?: boolean;
}

const KanbanColumn = ({ 
  title, 
  color = "bg-gray-200 dark:bg-gray-700", 
  children,
  onDragOver,
  onDrop,
  onEdit,
  onDelete,
  modern = true,
}: KanbanColumnProps) => {
  // Calculate the number of cards (exclude the add button)
  const cardCount = React.Children.toArray(children).filter(child => 
    React.isValidElement(child) && child.type !== Button
  ).length;
  
  return (
    <div 
      className={cn(
        "kanban-column animate-fade-in", 
        modern && "kanban-column-modern"
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className={cn("flex items-center mb-3", modern && "kanban-header-modern")}>
        <div className={cn("w-2.5 h-2.5 rounded-full mr-2", color)}></div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{title}</h3>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="bg-gray-200/80 dark:bg-gray-700/70 px-1.5 py-0.5 rounded text-xs font-medium text-gray-800 dark:text-gray-200">
            {cardCount > 0 ? cardCount : 0}
          </div>
          
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal size={14} className="text-gray-700 dark:text-gray-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border-border">
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                    <Edit size={14} className="mr-2" /> Editar
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={onDelete} 
                    className="text-red-600 dark:text-red-400 cursor-pointer"
                  >
                    <Trash2 size={14} className="mr-2" /> Excluir
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};

export default KanbanColumn;
