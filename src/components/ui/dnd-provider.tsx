
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { ReactNode } from "react";

interface DndProviderProps {
  items: string[];
  children: ReactNode;
  onDragEnd: (activeId: string, overId: string) => void;
}

export function DndProvider({ items, children, onDragEnd }: DndProviderProps) {
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      onDragEnd(active.id, over.id);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={items}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
