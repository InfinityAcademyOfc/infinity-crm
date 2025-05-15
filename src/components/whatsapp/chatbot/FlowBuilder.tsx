
import { useState } from "react";

interface FlowBuilderProps {
  items: string[];
  sessionId: string;
}

const FlowBuilder = ({ items, sessionId }: FlowBuilderProps) => {
  // Flow builder with sessionId support
  return (
    <div className="p-4 border rounded-lg min-h-[400px]">
      <div className="text-center text-muted-foreground">
        <p>Editor de fluxo para sessão: {sessionId}</p>
        <p className="mt-4">Arraste e solte os elementos para criar seu fluxo de chatbot:</p>
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {items.map((item) => (
            <div 
              key={item} 
              className="bg-muted p-2 rounded-md cursor-move shadow-sm hover:shadow"
              draggable
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlowBuilder;
