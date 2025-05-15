
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
    : null;

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
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
        <div 
          className="bg-green-500 dark:bg-green-600 h-1.5 rounded-full" 
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>

      {/* Card info row with date and value */}
      <div className="card-info-row">
        {formattedDate && (
          <div className="card-date">
            <Calendar size={12} />
            <span>{formattedDate}</span>
          </div>
        )}
        
        {card.value !== undefined && (
          <div className="card-value flex items-center gap-1">
            <DollarSign size={12} />
            <span>{card.value.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Assignee */}
      {card.assignedTo && (
        <div className="flex items-center mt-1">
          <Avatar className="h-5 w-5 mr-1">
            <AvatarImage src={card.assignedTo.avatar || "/placeholder.svg"} alt={card.assignedTo.name} />
            <AvatarFallback>
              {card.assignedTo.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{card.assignedTo.name}</span>
        </div>
      )}
    </div>
  );
};

export default MinimalistCardView;
