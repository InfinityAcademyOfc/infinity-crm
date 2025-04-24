
import { formatCurrency } from "@/lib/formatters";

// Types 
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

export const calculateCompletionPercentage = (checklist: ChecklistItem[], defaultCompletion?: number) => {
  return checklist.length > 0 
    ? Math.round((checklist.filter(item => item.completed).length / checklist.length) * 100) 
    : defaultCompletion || 0;
};
