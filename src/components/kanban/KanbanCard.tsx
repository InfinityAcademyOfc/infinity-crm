
import { ReactNode, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { KanbanCardItem } from "./types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPriorityColor, ChecklistItem } from "./KanbanCardUtils";
import MinimalistCardView from "./MinimalistCardView";
import CardDetailDialog from "./CardDetailDialog";

interface KanbanCardProps {
  card: KanbanCardItem;
  onDragStart: () => void;
  onClick: () => void;
  onDelete: () => void;
  children?: ReactNode;
  modern?: boolean;
}

const KanbanCard = ({
  card,
  onDragStart,
  onClick,
  onDelete,
  children,
  modern = true,
}: KanbanCardProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(card.checklist || []);

  // Prepare priority badge if card has priority
  const priorityBadge = card.priority ? (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
        card.priority
      )}`}
    >
      {card.priority.charAt(0).toUpperCase()}
    </span>
  ) : null;

  return (
    <>
      <div
        className={cn(
          "kanban-card group cursor-grab active:cursor-grabbing",
          "hover:border-primary/30 dark:hover:border-primary/40 transition-all",
          modern && "kanban-card-modern"
        )}
        draggable
        onDragStart={onDragStart}
        onClick={() => setIsDetailOpen(true)}
      >
        <MinimalistCardView card={card} priorityBadge={priorityBadge} />
        
        <DropdownMenu>
          <DropdownMenuTrigger className="absolute top-2 right-2 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal size={14} className="text-gray-500 dark:text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Detailed Card Dialog */}
      <CardDetailDialog 
        card={card}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onChecklistChange={setChecklist}
      />
    </>
  );
};

export default KanbanCard;
