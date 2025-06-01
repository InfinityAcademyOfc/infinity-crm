
import { useEffect } from "react";
import KanbanBoard from "../kanban/KanbanBoard";
import type { KanbanColumnItem } from "../kanban/types";

interface ProductionKanbanProps {
  columns: KanbanColumnItem[];
  setColumns: (columns: KanbanColumnItem[]) => void;
}

const ProductionKanban = ({ columns, setColumns }: ProductionKanbanProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setColumns([...columns]);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [columns, setColumns]);
  
  return (
    <div className="relative">
      <KanbanBoard 
        columns={columns}
        setColumns={setColumns}
      />
    </div>
  );
};

export default ProductionKanban;
