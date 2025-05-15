
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, ArrowRightLeft, Copy } from "lucide-react";
import { KanbanCardItem } from "./types";
import { formatDate } from "@/lib/formatters";
import ChecklistComponent from "./ChecklistComponent";
import { ChecklistItem } from "./KanbanCardUtils";

interface CardDetailDialogProps {
  card: KanbanCardItem;
  isOpen: boolean;
  onClose: () => void;
  onChecklistChange?: (items: ChecklistItem[]) => void;
  onMove?: (action: 'move' | 'duplicate') => void;
}

const CardDetailDialog = ({
  card,
  isOpen,
  onClose,
  onChecklistChange,
  onMove
}: CardDetailDialogProps) => {
  const [notes, setNotes] = useState(card.description || "");
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    card.checklist || []
  );

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleChecklistChange = (items: ChecklistItem[]) => {
    setChecklist(items);
    if (onChecklistChange) {
      onChecklistChange(items);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg md:max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{card.title}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-2 space-y-6 max-h-[calc(80vh-200px)] overflow-y-auto p-1">
          {/* Card tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {card.tags.map((tag, index) => (
                <Badge key={index} className={tag.color}>
                  {tag.label}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Card metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {card.value !== undefined && (
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="font-medium">
                    {typeof card.value === 'number'
                      ? new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(card.value)
                      : card.value}
                  </p>
                </div>
              </div>
            )}
            
            {card.dueDate && (
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prazo</p>
                  <p className="font-medium">{formatDate(card.dueDate)}</p>
                </div>
              </div>
            )}
            
            {card.assignedTo && (
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Responsável</p>
                  <p className="font-medium">
                    {typeof card.assignedTo === "object"
                      ? card.assignedTo.name
                      : card.assignedTo}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Descrição</h3>
            <Textarea
              placeholder="Adicionar descrição..."
              className="resize-none"
              value={notes}
              onChange={handleNotesChange}
              rows={4}
            />
          </div>
          
          {/* Checklist */}
          <ChecklistComponent 
            items={checklist} 
            onChange={handleChecklistChange}
          />
        </div>
        
        <DialogFooter className="flex justify-between items-center gap-2 mt-4">
          <div className="flex gap-2">
            {onMove && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => onMove('move')}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Mover
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => onMove('duplicate')}
                >
                  <Copy className="h-4 w-4" />
                  Duplicar
                </Button>
              </>
            )}
          </div>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CardDetailDialog;
