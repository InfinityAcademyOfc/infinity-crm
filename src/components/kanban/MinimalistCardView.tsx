
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { KanbanCardItem } from "./types";
import { calculateCompletionPercentage } from "./KanbanCardUtils";
import { Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface MinimalistViewProps {
  card: KanbanCardItem;
  priorityBadge: React.ReactNode;
}

const MinimalistCardView = ({ card, priorityBadge }: MinimalistViewProps) => {
  const completionPercentage = calculateCompletionPercentage(
    card.checklist || [], 
    card.completion
  );
  
  // Format date if available
  const formattedDate = card.dueDate 
    ? format(new Date(card.dueDate), 'dd/MM/yyyy')
    : card.metadata?.date || null;
  
  // Format value from either card.value or card.metadata.value
  const valueDisplay = card.value !== undefined 
    ? card.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : card.metadata?.value || null;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{card.title}</h4>
        {priorityBadge}
      </div>
      
      {card.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{card.description}</p>
      )}

      {/* Progress bar */}
      {completionPercentage > 0 && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
          <div 
            className="bg-green-500 dark:bg-green-600 h-1.5 rounded-full" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      )}

      {/* Card info row with date and value */}
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
        {formattedDate && (
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{formattedDate}</span>
          </div>
        )}
        
        {valueDisplay && (
          <div className="flex items-center gap-1">
            <DollarSign size={12} />
            <span>{valueDisplay}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {card.tags.map((tag, i) => (
            <span 
              key={i}
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${tag.color}`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {/* Assignee */}
      {(card.assignedTo || card.metadata?.assignee) && (
        <div className="flex items-center mt-1">
          <Avatar className="h-5 w-5 mr-1">
            <AvatarImage 
              src={card.assignedTo?.avatar || "/avatar-placeholder.jpg"} 
              alt={card.assignedTo?.name || card.metadata?.assignee || ""}
            />
            <AvatarFallback>
              {(card.assignedTo?.name || card.metadata?.assignee || "")
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {card.assignedTo?.name || card.metadata?.assignee}
          </span>
        </div>
      )}
    </div>
  );
};

export default MinimalistCardView;
