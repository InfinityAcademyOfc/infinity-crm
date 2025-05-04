
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MessageSquare, Clock, Image, FileText, Plus, MoveHorizontal, Settings } from "lucide-react";

interface FlowNodeProps {
  id: string;
  onEdit: () => void;
}

const FlowNode = ({ id, onEdit }: FlowNodeProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  // Map node types to icons and labels
  const nodeConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    "welcome-message": { 
      icon: <MessageSquare size={16} />, 
      label: "Mensagem de Boas-vindas", 
      color: "bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700"
    },
    "keyword-response": { 
      icon: <MessageSquare size={16} />, 
      label: "Resposta por Palavra-chave", 
      color: "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700"
    },
    "delay-action": { 
      icon: <Clock size={16} />, 
      label: "Atraso", 
      color: "bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-700"
    },
    "media-response": { 
      icon: <Image size={16} />, 
      label: "Envio de Mídia", 
      color: "bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700"
    },
    "conditional": { 
      icon: <Settings size={16} />, 
      label: "Condição", 
      color: "bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700"
    },
  };
  
  const config = nodeConfig[id] || { 
    icon: <FileText size={16} />, 
    label: "Ação", 
    color: "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700" 
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center justify-between p-3 mb-2 rounded-lg border ${config.color}`}
    >
      <div className="flex items-center gap-2">
        <div className="text-muted-foreground">{config.icon}</div>
        <span className="text-sm font-medium">{config.label}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
          <Settings size={14} />
        </Button>
        
        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-grab" {...listeners}>
          <MoveHorizontal size={14} />
        </Button>
      </div>
    </div>
  );
};

interface FlowBuilderProps {
  items: string[];
}

const FlowBuilder = ({ items }: FlowBuilderProps) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  const handleEditNode = (id: string) => {
    setSelectedNodeId(id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 border rounded-lg p-4">
        <h3 className="font-medium mb-4">Fluxo de Conversação</h3>
        <div className="space-y-2">
          {items.map((id) => (
            <FlowNode key={id} id={id} onEdit={() => handleEditNode(id)} />
          ))}
          
          <Button 
            variant="outline" 
            className="w-full mt-4 border-dashed text-muted-foreground"
          >
            <Plus size={16} className="mr-2" /> Adicionar novo nó
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-4">Propriedades</h3>
        {selectedNodeId ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Edite as propriedades do nó "{selectedNodeId}"
            </p>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <input type="text" className="w-full p-2 border rounded-md" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Resposta</label>
              <select className="w-full p-2 border rounded-md">
                <option value="text">Texto</option>
                <option value="media">Mídia</option>
                <option value="buttons">Botões</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Conteúdo</label>
              <textarea 
                rows={4} 
                className="w-full p-2 border rounded-md"
                placeholder="Digite a mensagem a ser enviada..."
              />
            </div>
            
            <div className="pt-2">
              <Button className="w-full">Salvar Alterações</Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Selecione um nó para editar suas propriedades.
          </p>
        )}
      </div>
    </div>
  );
};

export default FlowBuilder;
