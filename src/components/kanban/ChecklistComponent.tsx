
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ChecklistItem } from "./KanbanCardUtils";

export interface ChecklistProps {
  items: ChecklistItem[];
  onChange: (newChecklist: ChecklistItem[]) => void;
}

const ChecklistComponent = ({ items, onChange }: ChecklistProps) => {
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [showChecklistInput, setShowChecklistInput] = useState(false);

  const handleCheck = (id: string) => {
    const updatedChecklist = items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onChange(updatedChecklist);
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem = {
        id: Date.now().toString(),
        text: newChecklistItem,
        completed: false
      };
      onChange([...items, newItem]);
      setNewChecklistItem("");
      setShowChecklistInput(false);
    }
  };

  const removeChecklistItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Checklist ({items.filter(item => item.completed).length}/{items.length})</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-6 px-2 text-xs"
          onClick={() => setShowChecklistInput(true)}
        >
          <Plus size={12} className="mr-1" />
          Adicionar
        </Button>
      </div>
      
      {showChecklistInput && (
        <div className="flex gap-2 mb-2">
          <Textarea 
            placeholder="Nova tarefa..." 
            value={newChecklistItem}
            onChange={(e) => setNewChecklistItem(e.target.value)}
            className="text-xs min-h-8 h-8 py-1"
          />
          <Button size="sm" className="h-8" onClick={addChecklistItem}>
            Adicionar
          </Button>
        </div>
      )}
      
      <div className="space-y-1">
        {items.map(item => (
          <div key={item.id} className="flex items-start gap-2 group">
            <Checkbox 
              checked={item.completed} 
              onCheckedChange={() => handleCheck(item.id)} 
              className="mt-0.5"
            />
            <span className={cn(
              "text-sm flex-1", 
              item.completed && "line-through text-gray-500 dark:text-gray-400"
            )}>
              {item.text}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeChecklistItem(item.id)}
            >
              <Trash2 size={12} className="text-red-500" />
            </Button>
          </div>
        ))}
        
        {items.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma tarefa adicionada</p>
        )}
      </div>
    </div>
  );
};

export default ChecklistComponent;
