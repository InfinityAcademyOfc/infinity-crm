
import { KanbanCardItem, KanbanColumnItem } from "../types";
import { KanbanCardAssignee } from "../types";

export const getUniqueAssignees = (columns: KanbanColumnItem[]): KanbanCardAssignee[] => {
  const assigneesMap = new Map<string, KanbanCardAssignee>();
  
  columns.forEach((column) => {
    column.cards.forEach((card) => {
      if (card.assignedTo && card.assignedTo.id) {
        assigneesMap.set(card.assignedTo.id, card.assignedTo);
      }
    });
  });
  
  return Array.from(assigneesMap.values());
};

export const filterColumnsByAssignee = (columns: KanbanColumnItem[], assigneeId: string | null): KanbanColumnItem[] => {
  if (!assigneeId) return columns;
  
  return columns.map((column) => ({
    ...column,
    cards: column.cards.filter((card) => 
      card.assignedTo && card.assignedTo.id === assigneeId
    ),
  }));
};

export const getResponsiveColumnWidth = (columns: KanbanColumnItem[], zoomLevel: number, isExpanded: boolean): string => {
  const baseWidth = 280;
  const scaledWidth = baseWidth * zoomLevel;
  
  if (isExpanded) {
    // In expanded mode, divide available space by number of columns (min 250px, max 360px)
    const minWidth = Math.max(250, Math.min(360, scaledWidth));
    return `${minWidth}px`;
  }
  
  // Regular mode with zoom factor applied
  return `${scaledWidth}px`;
};

export const getContainerHeight = (isExpanded: boolean): string => {
  return isExpanded ? "calc(100vh - 250px)" : "600px";
};

// Function to calculate completion based on checklist or completion percentage
export const calculateCompletion = (
  checklist: { id: string; completed: boolean }[] | undefined, 
  completion: number | undefined
): number => {
  if (Array.isArray(checklist) && checklist.length > 0) {
    const completed = checklist.filter((item) => item.completed).length;
    return Math.round((completed / checklist.length) * 100);
  }
  
  return completion || 0;
};
