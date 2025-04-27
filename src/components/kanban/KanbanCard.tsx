
import { ReactNode, useState, memo } from "react";
import { MoreHorizontal, Copy, ArrowRightLeft } from "lucide-react";
import { KanbanCardItem } from "./types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  onMove?: (action: 'move' | 'duplicate') => void;
  children?: ReactNode;
  modern?: boolean;
}

// Usando memo para melhorar a performance de renderização
const KanbanCard = memo(({
  card,
  onDragStart,
  onClick,
  onDelete,
  onMove,
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

  // Usamos o servidor RequestAnimationFrame para evitar problemas de renderização
  const handleCardClick = () => {
    // Usar RAF para adiar a abertura do detalhe do card
    // Isso ajuda a evitar problemas de renderização
    requestAnimationFrame(() => {
      setIsDetailOpen(true);
    });
  };

  // Prevenir propagação de eventos para dropdown
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

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
        onClick={handleCardClick}
        data-draggable="true"
      >
        <MinimalistCardView card={card} priorityBadge={priorityBadge} />
        
        <DropdownMenu>
          <DropdownMenuTrigger className="absolute top-2 right-2 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleDropdownClick}>
            <MoreHorizontal size={14} className="text-gray-500 dark:text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onMove && (
              <>
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMove('move');
                  }}
                >
                  <ArrowRightLeft size={14} />
                  Mover card
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMove('duplicate');
                  }}
                >
                  <Copy size={14} />
                  Duplicar card
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
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
      {isDetailOpen && (
        <CardDetailDialog 
          card={card}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onChecklistChange={setChecklist}
          onMove={onMove}
        />
      )}
    </>
  );
});

// Definir displayName para o componente memo
KanbanCard.displayName = "KanbanCard";

export default KanbanCard;
