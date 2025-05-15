
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Plus, Workflow, Square, Circle, Triangle, Scissors, Type, Smile, PenTool, Eraser } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import NodeTemplates, { nodeTemplates } from "./NodeTemplates";

// Define a base template type with common properties
interface BaseNodeTemplate {
  id: string;
  name: string;
  shape: string;
  color: string;
  icon: React.ReactElement;
  category: string;
  renderContent: () => React.ReactElement;
}

// Define a type for templates with nodes and connections
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

// Define a type for simple templates without nodes and connections
interface SimpleNodeTemplate extends BaseNodeTemplate {
  nodes?: never;
  connections?: never;
}

// Combined type that can be either a simple or complex template
type NodeTemplateType = SimpleNodeTemplate | ComplexNodeTemplate;

interface SidebarPanelProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  nodeName: string;
  setNodeName: (name: string) => void;
  onAddNode: () => void;
  templates?: NodeTemplateType[];
  onAddTemplate?: (template: any) => void;
}

const SidebarPanel = ({
  sidebarOpen,
  setSidebarOpen,
  nodeName,
  setNodeName,
  onAddNode,
  templates = nodeTemplates,
  onAddTemplate
}: SidebarPanelProps) => {
  const [toolTab, setToolTab] = useState<string>("nós");
  
  const shapes = [
    { id: "square", name: "Quadrado", icon: <Square className="h-4 w-4" /> },
    { id: "circle", name: "Círculo", icon: <Circle className="h-4 w-4" /> },
    { id: "triangle", name: "Triângulo", icon: <Triangle className="h-4 w-4" /> }
  ];
  
  const tools = [
    { id: "text", name: "Texto", icon: <Type className="h-4 w-4" /> },
    { id: "pen", name: "Caneta", icon: <PenTool className="h-4 w-4" /> },
    { id: "eraser", name: "Borracha", icon: <Eraser className="h-4 w-4" /> },
    { id: "cut", name: "Recorte", icon: <Scissors className="h-4 w-4" /> }
  ];
  
  const emojis = ["😊", "👍", "✅", "❌", "⭐", "💡", "🎯", "⚠️"];
  
  return <>
      <div className={cn("bg-card/80 dark:bg-gray-800/40 backdrop-blur-md border-r transition-all duration-300 flex flex-col", sidebarOpen ? "w-64" : "w-0 overflow-hidden")}>
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-medium flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Mapa Mental
          </h2>
        </div>
        
        <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Novo Nó</h3>
            <div className="flex gap-2">
              <Input placeholder="Nome do nó" value={nodeName} onChange={e => setNodeName(e.target.value)} className="text-sm h-8" />
              <Button size="sm" variant="outline" onClick={onAddNode} className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />
          
          <Tabs value={toolTab} onValueChange={setToolTab}>
            <TabsList className="grid grid-cols-3 h-8">
              <TabsTrigger value="nós" className="text-xs">Nós</TabsTrigger>
              <TabsTrigger value="formas" className="text-xs">Formas</TabsTrigger>
              <TabsTrigger value="ferramentas" className="text-xs">Ferramentas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="nós" className="mt-2">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Templates</h3>
                <div className="max-h-48 overflow-y-auto pr-2">
                  <NodeTemplates templates={templates} onAddTemplate={onAddTemplate} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="formas" className="mt-2">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Formas Básicas</h3>
                <div className="grid grid-cols-3 gap-2">
                  {shapes.map(shape => (
                    <Button 
                      key={shape.id}
                      variant="outline" 
                      size="sm" 
                      className="flex flex-col items-center justify-center p-2 h-auto aspect-square"
                      onClick={() => {
                        const template: SimpleNodeTemplate = {
                          id: shape.id,
                          name: shape.name,
                          shape: shape.id === "triangle" ? "triangle" : shape.id === "circle" ? "circle" : "rectangle",
                          color: "#8B5CF6",
                          category: "formas",
                          icon: shape.icon,
                          renderContent: () => (
                            <div className="w-8 h-8 flex items-center justify-center">
                              {shape.icon}
                            </div>
                          )
                        };
                        onAddTemplate && onAddTemplate(template);
                      }}
                    >
                      {shape.icon}
                      <span className="text-xs mt-1">{shape.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <h3 className="text-sm font-medium">Emojis</h3>
                <div className="grid grid-cols-4 gap-2">
                  {emojis.map(emoji => (
                    <Button 
                      key={emoji}
                      variant="outline" 
                      size="sm" 
                      className="flex items-center justify-center p-1 h-8"
                      onClick={() => {
                        setNodeName(emoji);
                        onAddNode();
                      }}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ferramentas" className="mt-2">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Ferramentas de Desenho</h3>
                <div className="grid grid-cols-2 gap-2">
                  {tools.map(tool => (
                    <Button 
                      key={tool.id}
                      variant="outline" 
                      size="sm" 
                      className="flex items-center justify-between px-2 h-8"
                    >
                      {tool.icon}
                      <span className="text-xs">{tool.name}</span>
                    </Button>
                  ))}
                </div>
                
                <Card className="mt-2">
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground">
                      Ferramenta em desenvolvimento. Em breve você poderá desenhar diretamente no mapa mental.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Instruções</h3>
            <ul className="text-xs space-y-1 text-muted-foreground list-disc list-inside">
              <li>Arraste para mover os nós</li>
              <li>Clique duplo para editar um nó</li>
              <li>Conecte nós clicando em um ponto e arrastando para outro</li>
              <li>Use os ícones + nos nós para personalizar</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Toggle Sidebar Button */}
      <Button variant="ghost" size="icon" className="absolute top-4 left-0 z-10 h-7 w-7 bg-card shadow-md rounded-r-md rounded-l-none border-l-0" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    </>;
};

export default SidebarPanel;
