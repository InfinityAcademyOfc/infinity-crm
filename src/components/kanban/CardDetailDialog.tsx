
import { useState } from "react";
import { Link } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { KanbanCardItem } from "./types";
import { ChecklistItem, getPriorityColor } from "./KanbanCardUtils";
import ChecklistComponent from "./ChecklistComponent";
import { formatCurrency } from "@/lib/formatters";

interface CardDetailDialogProps {
  card: KanbanCardItem;
  isOpen: boolean;
  onClose: () => void;
  onChecklistChange?: (checklist: ChecklistItem[]) => void;
}

const CardDetailDialog = ({ card, isOpen, onClose, onChecklistChange }: CardDetailDialogProps) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(card.checklist || []);

  const handleChecklistChange = (newChecklist: ChecklistItem[]) => {
    setChecklist(newChecklist);
    if (onChecklistChange) {
      onChecklistChange(newChecklist);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{card.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium mb-1">Descrição</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{card.description || "Sem descrição"}</p>
          </div>
          
          {/* Client */}
          {card.client && (
            <div>
              <h3 className="text-sm font-medium mb-1">Cliente</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{card.client}</p>
            </div>
          )}
          
          {/* Tags and Priority */}
          <div>
            <h3 className="text-sm font-medium mb-1">Selos e Prioridade</h3>
            <div className="flex flex-wrap gap-1">
              {card.tags?.map((tag, index) => (
                <Badge key={index} variant="outline" className={tag.color}>
                  {tag.label}
                </Badge>
              ))}
              {card.priority && (
                <Badge className={getPriorityColor(card.priority)}>
                  {card.priority.charAt(0).toUpperCase() + card.priority.slice(1)}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Assignee */}
          {card.assignedTo && (
            <div>
              <h3 className="text-sm font-medium mb-1">Responsável</h3>
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={card.assignedTo.avatar || "/placeholder.svg"} alt={card.assignedTo.name} />
                  <AvatarFallback>
                    {card.assignedTo.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{card.assignedTo.name}</span>
              </div>
            </div>
          )}
          
          {/* Value */}
          {card.value !== undefined && (
            <div>
              <h3 className="text-sm font-medium mb-1">Valor</h3>
              <p className="text-sm font-medium">{formatCurrency(card.value)}</p>
            </div>
          )}
          
          {/* Checklist */}
          <ChecklistComponent checklist={checklist} onChecklistChange={handleChecklistChange} />
          
          {/* Links */}
          <div>
            <h3 className="text-sm font-medium mb-1">Links</h3>
            {card.links ? (
              <div className="space-y-1">
                {card.links.map((link, index) => (
                  <a 
                    key={index} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Link size={14} className="mr-1" />
                    {link.label || link.url}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum link adicionado</p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CardDetailDialog;
