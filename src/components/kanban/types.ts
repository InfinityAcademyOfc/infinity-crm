
export interface KanbanCardTag {
  label: string;
  color: string;
}

export interface KanbanCardAssignee {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface KanbanCardLink {
  url: string;
  label?: string;
}

export interface KanbanCardChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface KanbanCardMetadata {
  value?: string;
  assignee?: string;
  date?: string;
}

export interface KanbanCardItem {
  id: string;
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  tags?: KanbanCardTag[];
  assignedTo?: KanbanCardAssignee;
  completion?: number;
  value?: number;
  client?: string;
  createdAt?: string;
  updatedAt?: string;
  checklist?: KanbanCardChecklistItem[];
  links?: KanbanCardLink[];
  metadata?: KanbanCardMetadata;
}

export interface KanbanColumnItem {
  id: string;
  title: string;
  cards: KanbanCardItem[];
  color?: string;
}
