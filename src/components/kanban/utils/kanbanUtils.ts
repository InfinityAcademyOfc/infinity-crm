
import { KanbanColumnItem } from "../types";

export const getUniqueAssignees = (columns: KanbanColumnItem[]): string[] => {
  return Array.from(
    new Set(
      columns
        .flatMap(col => col.cards)
        .filter(card => card.assignedTo)
        .map(card => card.assignedTo?.name)
    )
  ).filter(Boolean) as string[];
};

export const filterColumnsByAssignee = (
  columns: KanbanColumnItem[],
  filterByAssignee: string | null
): KanbanColumnItem[] => {
  if (!filterByAssignee) return columns;
  
  return columns.map(column => ({
    ...column,
    cards: column.cards.filter(card => card.assignedTo?.name === filterByAssignee)
  }));
};

export const getResponsiveColumnWidth = (
  columns: KanbanColumnItem[],
  zoomLevel: number,
  isExpanded: boolean
): string => {
  const baseWidth = Math.max(14, Math.min(20, 70 / (columns.length || 1)));
  return isExpanded ? `${baseWidth * zoomLevel}rem` : `${baseWidth * zoomLevel * 0.85}rem`;
};

export const getContainerHeight = (isExpanded: boolean): string => {
  return isExpanded ? "min-h-[750px]" : "min-h-[550px]";
};
