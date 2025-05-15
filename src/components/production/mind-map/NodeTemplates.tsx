import React from "react";
import { Fuel, FileText, Network, Workflow, Shapes, Layout, Triangle, Palette } from "lucide-react";
import { Node } from 'reactflow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BaseNodeTemplate {
  id: string;
  name: string;
  shape: string;
  color: string;
  icon: React.ReactElement;
  category: string;
  renderContent: () => React.ReactElement;
}

interface ComplexNodeTemplate extends BaseNodeTemplate {
  nodes: Array<{
    label: string;
    offsetX: number;
    offsetY: number;
    color: string;
    shape: string;
  }>;
  connections: Array<{
    source: number;
    target: number;
    color?: string;
    width?: number;
  }>;
}

interface SimpleNodeTemplate extends BaseNodeTemplate {
  nodes?: never;
  connections?: never;
}

type NodeTemplateType = SimpleNodeTemplate | ComplexNodeTemplate;

export const nodeTemplates: NodeTemplateType[] = [
  {
    id: "funnel",
    name: "Funil",
    shape: "funnel",
    color: "#F97316",
    icon: <Fuel />,
    category: "estruturas",
    renderContent: () => (
      <svg width="36" height="24" viewBox="0 0 36 24">
        <path d="M2,0 L34,0 L28,14 L28,23 L8,23 L8,14 Z" fill="#F97316" stroke="#d97706" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "note",
    name: "Bloco de Notas",
    shape: "notepad",
    color: "#FDE1D3",
    icon: <FileText />,
    category: "formas",
    renderContent: () => (
      <svg width="32" height="24" viewBox="0 0 32 24">
        <rect x="2" y="2" width="28" height="20" rx="4" fill="#FDE1D3" stroke="#db9c5e" strokeWidth="2"/>
        <line x1="8" y1="8" x2="24" y2="8" stroke="#db9c5e" strokeWidth="1"/>
        <line x1="8" y1="12" x2="24" y2="12" stroke="#db9c5e" strokeWidth="1"/>
        <line x1="8" y1="16" x2="20" y2="16" stroke="#db9c5e" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    id: "highlight",
    name: "Linha de escrita",
    shape: "highlight",
    color: "#FEF7CD",
    icon: <FileText />,
    category: "formas",
    renderContent: () => (
      <svg width="32" height="24" viewBox="0 0 32 24">
        <rect x="2" y="8" width="28" height="8" fill="#FEF7CD" stroke="#E5AC00" strokeWidth="1"/>
        <line x1="4" y1="12" x2="28" y2="12" stroke="#E5AC00" strokeWidth="1" strokeDasharray="2,2"/>
      </svg>
    ),
  },
  {
    id: "fluxograma",
    name: "Fluxograma Básico",
    shape: "rectangle",
    color: "#8B5CF6",
    icon: <Network />,
    category: "estruturas",
    nodes: [
      { label: "Início", offsetX: 0, offsetY: 0, color: "#8B5CF6", shape: "roundedRect" },
      { label: "Processo 1", offsetX: 180, offsetY: 0, color: "#0EA5E9", shape: "rectangle" },
      { label: "Decisão", offsetX: 180, offsetY: 100, color: "#F97316", shape: "diamond" },
      { label: "Fim", offsetX: 0, offsetY: 100, color: "#22C55E", shape: "roundedRect" }
    ],
    connections: [
      { source: 0, target: 1 },
      { source: 1, target: 2 },
      { source: 2, target: 3 }
    ],
    renderContent: () => (
      <svg width="50" height="28" viewBox="0 0 50 28">
        <rect x="2" y="2" width="12" height="8" rx="2" fill="#8B5CF6" stroke="#7C3AED" strokeWidth="1"/>
        <rect x="20" y="2" width="12" height="8" fill="#0EA5E9" stroke="#0284C7" strokeWidth="1"/>
        <polygon points="26,18 32,14 26,10 20,14" fill="#F97316" stroke="#EA580C" strokeWidth="1"/>
        <rect x="2" y="18" width="12" height="8" rx="2" fill="#22C55E" stroke="#16A34A" strokeWidth="1"/>
        <line x1="14" y1="6" x2="20" y2="6" stroke="#333" strokeWidth="1"/>
        <line x1="32" y1="6" x2="38" y2="6" stroke="#333" strokeWidth="1"/>
        <line x1="26" y1="10" x2="26" y2="14" stroke="#333" strokeWidth="1"/>
        <line x1="20" y1="14" x2="14" y2="14" stroke="#333" strokeWidth="1"/>
        <line x1="8" y1="10" x2="8" y2="18" stroke="#333" strokeWidth="1"/>
      </svg>
    )
  },
  {
    id: "processoquadro",
    name: "Quadro de Processo",
    shape: "rectangle",
    color: "#0EA5E9",
    icon: <Layout />,
    category: "estruturas",
    nodes: [
      { label: "Planejamento", offsetX: 0, offsetY: 0, color: "#0EA5E9", shape: "rectangle" },
      { label: "Execução", offsetX: 150, offsetY: 0, color: "#0EA5E9", shape: "rectangle" },
      { label: "Verificação", offsetX: 0, offsetY: 80, color: "#0EA5E9", shape: "rectangle" },
      { label: "Ação", offsetX: 150, offsetY: 80, color: "#0EA5E9", shape: "rectangle" }
    ],
    connections: [
      { source: 0, target: 1 },
      { source: 1, target: 3 },
      { source: 3, target: 2 },
      { source: 2, target: 0 }
    ],
    renderContent: () => (
      <svg width="50" height="28" viewBox="0 0 50 28">
        <rect x="2" y="2" width="18" height="10" fill="#0EA5E9" stroke="#0284C7" strokeWidth="1"/>
        <rect x="30" y="2" width="18" height="10" fill="#0EA5E9" stroke="#0284C7" strokeWidth="1"/>
        <rect x="2" y="16" width="18" height="10" fill="#0EA5E9" stroke="#0284C7" strokeWidth="1"/>
        <rect x="30" y="16" width="18" height="10" fill="#0EA5E9" stroke="#0284C7" strokeWidth="1"/>
        <path d="M20,7 L30,7 M48,7 C48,12 48,16 39,16 M11,16 C2,16 2,12 2,7 M20,21 L30,21" stroke="#555" strokeWidth="1" fill="none"/>
      </svg>
    )
  },
  {
    id: "triangulo",
    name: "Triângulo",
    shape: "triangle",
    color: "#F59E0B",
    icon: <Triangle />,
    category: "formas",
    renderContent: () => (
      <svg width="32" height="24" viewBox="0 0 32 24">
        <polygon points="16,2 30,22 2,22" fill="#F59E0B" stroke="#D97706" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    id: "mindmap",
    name: "Mapa Mental Básico",
    shape: "roundedRect",
    color: "#8B5CF6",
    icon: <Workflow />,
    category: "estruturas",
    nodes: [
      { label: "Ideia Central", offsetX: 0, offsetY: 0, color: "#8B5CF6", shape: "roundedRect" },
      { label: "Tópico 1", offsetX: -150, offsetY: -80, color: "#0EA5E9", shape: "rectangle" },
      { label: "Tópico 2", offsetX: 150, offsetY: -80, color: "#0EA5E9", shape: "rectangle" },
      { label: "Tópico 3", offsetX: -150, offsetY: 80, color: "#0EA5E9", shape: "rectangle" },
      { label: "Tópico 4", offsetX: 150, offsetY: 80, color: "#0EA5E9", shape: "rectangle" },
      { label: "Subtópico 1.1", offsetX: -250, offsetY: -120, color: "#22C55E", shape: "roundedRect" },
      { label: "Subtópico 2.1", offsetX: 250, offsetY: -120, color: "#22C55E", shape: "roundedRect" }
    ],
    connections: [
      { source: 0, target: 1 },
      { source: 0, target: 2 },
      { source: 0, target: 3 },
      { source: 0, target: 4 },
      { source: 1, target: 5 },
      { source: 2, target: 6 }
    ],
    renderContent: () => (
      <svg width="50" height="30" viewBox="0 0 50 30">
        <rect x="20" y="12" width="10" height="6" rx="2" fill="#8B5CF6" stroke="#7C3AED" strokeWidth="1"/>
        <rect x="5" y="5" width="8" height="5" fill="#0EA5E9" stroke="#0284C7" strokeWidth="1"/>
        <rect x="37" y="5" width="8" height="5" fill="#0EA5E9" stroke="#0284C7" strokeWidth="1"/>
        <rect x="5" y="20" width="8" height="5" fill="#0EA5E9" stroke="#0284C7" strokeWidth="1"/>
        <rect x="37" y="20" width="8" height="5" fill="#0EA5E9" stroke="#0284C7" strokeWidth="1"/>
        <rect x="0" y="0" width="6" height="4" rx="1" fill="#22C55E" stroke="#16A34A" strokeWidth="1"/>
        <rect x="44" y="0" width="6" height="4" rx="1" fill="#22C55E" stroke="#16A34A" strokeWidth="1"/>
        <line x1="20" y1="15" x2="13" y2="7.5" stroke="#333" strokeWidth="1"/>
        <line x1="30" y1="15" x2="37" y2="7.5" stroke="#333" strokeWidth="1"/>
        <line x1="20" y1="15" x2="13" y2="22.5" stroke="#333" strokeWidth="1"/>
        <line x1="30" y1="15" x2="37" y2="22.5" stroke="#333" strokeWidth="1"/>
        <line x1="5" y1="5" x2="3" y2="4" stroke="#333" strokeWidth="1"/>
        <line x1="45" y1="5" x2="47" y2="4" stroke="#333" strokeWidth="1"/>
      </svg>
    )
  }
];

interface NodeTemplatesProps {
  templates?: NodeTemplateType[];
  onAddTemplate?: (template: any) => void;
}

const NodeTemplates: React.FC<NodeTemplatesProps> = ({ templates = nodeTemplates, onAddTemplate }) => {
  const categorizedTemplates = {
    estruturas: templates.filter(t => t.category === 'estruturas'),
    formas: templates.filter(t => t.category === 'formas'),
    todos: templates
  };
  
  return (
    <Tabs defaultValue="todos">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="todos" className="text-xs">Todos</TabsTrigger>
        <TabsTrigger value="estruturas" className="text-xs">Estruturas</TabsTrigger>
        <TabsTrigger value="formas" className="text-xs">Formas</TabsTrigger>
      </TabsList>
      
      {Object.entries(categorizedTemplates).map(([category, items]) => (
        <TabsContent key={category} value={category} className="mt-2">
          <div className="flex flex-wrap gap-3">
            {items.map(template => (
              <button 
                key={template.id}
                type="button"
                className="flex flex-col items-center justify-center gap-1 hover:bg-accent rounded p-2 border"
                onClick={() => onAddTemplate && onAddTemplate(template)}
                title={template.name}
              >
                <div>
                  {template.renderContent()}
                </div>
                <span className="text-xs">{template.name}</span>
              </button>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default NodeTemplates;
