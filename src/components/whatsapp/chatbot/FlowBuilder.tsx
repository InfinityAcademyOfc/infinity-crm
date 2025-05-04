
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  MessageSquare, 
  Clock, 
  Image, 
  FileText, 
  Plus, 
  MoveHorizontal, 
  Settings, 
  ArrowRight,
  Link,
  MessageCircle,
  Timer,
  FileImage,
  Check
} from "lucide-react";

// Define node types for the flow builder
type NodeType = 
  | "welcome-message" 
  | "keyword-response" 
  | "delay-action" 
  | "media-response" 
  | "conditional" 
  | "button-option"
  | "sequence" 
  | "first-contact" 
  | "daily-first" 
  | "time-trigger";

interface FlowNode {
  id: string;
  type: NodeType;
  label: string;
  content?: string;
  delay?: number;
  condition?: string;
  mediaUrl?: string;
  buttons?: string[];
  nextNodeId?: string;
  branches?: {condition: string, nextNodeId: string}[];
}

interface FlowNodeProps {
  id: string;
  type: NodeType;
  label: string;
  onEdit: () => void;
}

const FlowNode = ({ id, type, label, onEdit }: FlowNodeProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  // Map node types to icons and labels
  const nodeConfig: Record<NodeType, { icon: React.ReactNode; color: string }> = {
    "welcome-message": { 
      icon: <MessageSquare size={16} />, 
      color: "bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700"
    },
    "keyword-response": { 
      icon: <MessageCircle size={16} />, 
      color: "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700"
    },
    "delay-action": { 
      icon: <Clock size={16} />, 
      color: "bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-700"
    },
    "media-response": { 
      icon: <FileImage size={16} />, 
      color: "bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700"
    },
    "conditional": { 
      icon: <Settings size={16} />, 
      color: "bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700"
    },
    "button-option": { 
      icon: <Plus size={16} />, 
      color: "bg-pink-100 border-pink-300 dark:bg-pink-900/30 dark:border-pink-700"
    },
    "sequence": { 
      icon: <ArrowRight size={16} />, 
      color: "bg-indigo-100 border-indigo-300 dark:bg-indigo-900/30 dark:border-indigo-700"
    },
    "first-contact": { 
      icon: <MessageSquare size={16} />, 
      color: "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700"
    },
    "daily-first": { 
      icon: <Check size={16} />, 
      color: "bg-teal-100 border-teal-300 dark:bg-teal-900/30 dark:border-teal-700"
    },
    "time-trigger": { 
      icon: <Timer size={16} />, 
      color: "bg-cyan-100 border-cyan-300 dark:bg-cyan-900/30 dark:border-cyan-700"
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center justify-between p-3 mb-2 rounded-lg border ${nodeConfig[type].color}`}
    >
      <div className="flex items-center gap-2">
        <div className="text-muted-foreground">{nodeConfig[type].icon}</div>
        <span className="text-sm font-medium">{label}</span>
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

interface FlowConnectionProps {
  from: string;
  to: string;
}

const FlowConnection = ({ from, to }: FlowConnectionProps) => {
  return (
    <div className="relative h-8 flex items-center justify-center">
      <div className="absolute w-0.5 h-full bg-gray-300 dark:bg-gray-600"></div>
      <ArrowRight className="absolute bottom-0 text-gray-400" size={16} />
    </div>
  );
};

interface FlowBuilderProps {
  items: string[];
}

const FlowBuilder = ({ items }: FlowBuilderProps) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [flowNodes, setFlowNodes] = useState<FlowNode[]>([
    {
      id: "welcome-message",
      type: "welcome-message",
      label: "Mensagem de Boas-vindas",
      content: "Olá! Bem-vindo ao nosso atendimento automatizado."
    },
    {
      id: "keyword-response", 
      type: "keyword-response",
      label: "Resposta por Palavra-chave",
      content: "Entendi sua dúvida. Vamos ajudar com isso!"
    },
    {
      id: "delay-action",
      type: "delay-action",
      label: "Atraso",
      delay: 3
    },
    {
      id: "media-response",
      type: "media-response",
      label: "Envio de Mídia",
      mediaUrl: "https://example.com/image.jpg"
    },
    {
      id: "conditional",
      type: "conditional",
      label: "Condição",
      branches: [
        {condition: "msg.includes('ajuda')", nextNodeId: "keyword-response"},
        {condition: "msg.includes('imagem')", nextNodeId: "media-response"}
      ]
    }
  ]);
  
  const [availableNodeTypes] = useState<Array<{type: NodeType, label: string}>>([
    { type: "welcome-message", label: "Mensagem de Boas-vindas" },
    { type: "keyword-response", label: "Resposta por Palavra-chave" },
    { type: "delay-action", label: "Atraso" },
    { type: "media-response", label: "Envio de Mídia" },
    { type: "conditional", label: "Condição" },
    { type: "button-option", label: "Botões de Opção" },
    { type: "sequence", label: "Sequência" },
    { type: "first-contact", label: "Primeira Mensagem" },
    { type: "daily-first", label: "Primeira do Dia" },
    { type: "time-trigger", label: "Gatilho de Horário" },
  ]);
  
  const handleEditNode = (id: string) => {
    setSelectedNodeId(id);
  };

  const handleAddNode = (type: NodeType) => {
    const newNode: FlowNode = {
      id: `${type}-${Date.now()}`,
      type: type,
      label: availableNodeTypes.find(node => node.type === type)?.label || "Novo Nó"
    };
    
    setFlowNodes([...flowNodes, newNode]);
  };
  
  const selectedNode = selectedNodeId 
    ? flowNodes.find(node => node.id === selectedNodeId) 
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h3 className="font-medium mb-4">Blocos Disponíveis</h3>
          <div className="flex flex-wrap gap-2">
            {availableNodeTypes.map((nodeType) => (
              <Button
                key={nodeType.type}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => handleAddNode(nodeType.type)}
              >
                <Plus size={14} />
                <span>{nodeType.label}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">Fluxo de Conversação</h3>
          <div className="space-y-1">
            {flowNodes.map((node, index) => (
              <div key={node.id}>
                <FlowNode 
                  id={node.id}
                  type={node.type}
                  label={node.label}
                  onEdit={() => handleEditNode(node.id)} 
                />
                {index < flowNodes.length - 1 && (
                  <FlowConnection from={node.id} to={flowNodes[index + 1].id} />
                )}
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full mt-4 border-dashed text-muted-foreground"
              onClick={() => handleAddNode("welcome-message")}
            >
              <Plus size={16} className="mr-2" /> Adicionar novo nó
            </Button>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-4">Propriedades</h3>
        {selectedNode ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Edite as propriedades do nó "{selectedNode.label}"
            </p>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                value={selectedNode.label}
                onChange={(e) => {
                  // Implement state update logic
                  setFlowNodes(flowNodes.map(node => 
                    node.id === selectedNode.id ? {...node, label: e.target.value} : node
                  ));
                }}
              />
            </div>
            
            {selectedNode.type === "welcome-message" || selectedNode.type === "keyword-response" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">Conteúdo da Mensagem</label>
                <textarea 
                  rows={4} 
                  className="w-full p-2 border rounded-md"
                  placeholder="Digite a mensagem a ser enviada..."
                  value={selectedNode.content || ""}
                  onChange={(e) => {
                    setFlowNodes(flowNodes.map(node => 
                      node.id === selectedNode.id ? {...node, content: e.target.value} : node
                    ));
                  }}
                />
              </div>
            ) : null}
            
            {selectedNode.type === "delay-action" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Tempo de Delay (segundos)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-md"
                  min="1" 
                  max="60" 
                  value={selectedNode.delay || 3}
                  onChange={(e) => {
                    setFlowNodes(flowNodes.map(node => 
                      node.id === selectedNode.id ? {...node, delay: parseInt(e.target.value)} : node
                    ));
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Define o tempo de espera antes de enviar a próxima mensagem (em segundos)
                </p>
              </div>
            )}
            
            {selectedNode.type === "media-response" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">URL da Mídia</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={selectedNode.mediaUrl || ""}
                  onChange={(e) => {
                    setFlowNodes(flowNodes.map(node => 
                      node.id === selectedNode.id ? {...node, mediaUrl: e.target.value} : node
                    ));
                  }}
                />
                <div className="space-y-2 mt-2">
                  <label className="text-sm font-medium">Tipo de Mídia</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="image">Imagem</option>
                    <option value="audio">Áudio</option>
                    <option value="video">Vídeo</option>
                    <option value="document">Documento</option>
                  </select>
                </div>
              </div>
            )}
            
            {selectedNode.type === "conditional" && (
              <div className="space-y-4">
                <label className="text-sm font-medium">Condições</label>
                
                {(selectedNode.branches || []).map((branch, index) => (
                  <div key={index} className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Condição {index + 1}</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md"
                        placeholder="msg.includes('palavra')"
                        value={branch.condition}
                        onChange={(e) => {
                          const newBranches = [...(selectedNode.branches || [])];
                          newBranches[index].condition = e.target.value;
                          setFlowNodes(flowNodes.map(node => 
                            node.id === selectedNode.id ? {...node, branches: newBranches} : node
                          ));
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2 mt-2">
                      <label className="text-xs font-medium">Próximo Nó</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={branch.nextNodeId || ""}
                        onChange={(e) => {
                          const newBranches = [...(selectedNode.branches || [])];
                          newBranches[index].nextNodeId = e.target.value;
                          setFlowNodes(flowNodes.map(node => 
                            node.id === selectedNode.id ? {...node, branches: newBranches} : node
                          ));
                        }}
                      >
                        <option value="">Selecione um nó</option>
                        {flowNodes.map(node => (
                          <option key={node.id} value={node.id}>{node.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-red-500 hover:text-red-700"
                      onClick={() => {
                        const newBranches = (selectedNode.branches || []).filter((_, i) => i !== index);
                        setFlowNodes(flowNodes.map(node => 
                          node.id === selectedNode.id ? {...node, branches: newBranches} : node
                        ));
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const newBranch = { condition: "", nextNodeId: "" };
                    const newBranches = [...(selectedNode.branches || []), newBranch];
                    setFlowNodes(flowNodes.map(node => 
                      node.id === selectedNode.id ? {...node, branches: newBranches} : node
                    ));
                  }}
                >
                  <Plus size={14} className="mr-2" /> Adicionar condição
                </Button>
              </div>
            )}
            
            {selectedNode.type === "button-option" && (
              <div className="space-y-4">
                <label className="text-sm font-medium">Botões</label>
                
                {(selectedNode.buttons || []).map((button, index) => (
                  <div key={index} className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Texto do Botão {index + 1}</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md"
                        placeholder="Texto do botão"
                        value={button}
                        onChange={(e) => {
                          const newButtons = [...(selectedNode.buttons || [])];
                          newButtons[index] = e.target.value;
                          setFlowNodes(flowNodes.map(node => 
                            node.id === selectedNode.id ? {...node, buttons: newButtons} : node
                          ));
                        }}
                      />
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-red-500 hover:text-red-700"
                      onClick={() => {
                        const newButtons = (selectedNode.buttons || []).filter((_, i) => i !== index);
                        setFlowNodes(flowNodes.map(node => 
                          node.id === selectedNode.id ? {...node, buttons: newButtons} : node
                        ));
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const newButtons = [...(selectedNode.buttons || []), "Novo Botão"];
                    setFlowNodes(flowNodes.map(node => 
                      node.id === selectedNode.id ? {...node, buttons: newButtons} : node
                    ));
                  }}
                >
                  <Plus size={14} className="mr-2" /> Adicionar botão
                </Button>
              </div>
            )}
            
            {(selectedNode.type === "time-trigger") && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Horário de Disparo</label>
                <input 
                  type="time" 
                  className="w-full p-2 border rounded-md"
                />
                <div className="space-y-2 mt-2">
                  <label className="text-sm font-medium">Dias da Semana</label>
                  <div className="flex flex-wrap gap-2">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
                      <label key={index} className="flex items-center gap-1">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span>{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Próximo Nó</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedNode.nextNodeId || ""}
                onChange={(e) => {
                  setFlowNodes(flowNodes.map(node => 
                    node.id === selectedNode.id ? {...node, nextNodeId: e.target.value} : node
                  ));
                }}
              >
                <option value="">Fim do fluxo</option>
                {flowNodes
                  .filter(node => node.id !== selectedNode.id)
                  .map(node => (
                    <option key={node.id} value={node.id}>{node.label}</option>
                  ))
                }
              </select>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button className="w-full">Salvar Alterações</Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Selecione um nó do fluxo para editar suas propriedades.
          </p>
        )}
      </div>
    </div>
  );
};

export default FlowBuilder;
