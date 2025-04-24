
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Plus, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface SidebarPanelProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  nodeName: string;
  setNodeName: (name: string) => void;
  onAddNode: () => void;
  templates?: Array<{id: string; name: string; shape: string; color: string}>;
  onAddTemplate?: (template: any) => void;
}

const SidebarPanel = ({ 
  sidebarOpen, 
  setSidebarOpen,
  nodeName,
  setNodeName,
  onAddNode,
  templates = [],
  onAddTemplate
}: SidebarPanelProps) => {
  return (
    <>
      <div 
        className={cn(
          "bg-card/80 dark:bg-gray-800/40 backdrop-blur-md border-r transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        )}
      >
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
              <Input
                placeholder="Nome do nó"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                className="text-sm h-8"
              />
              <Button size="sm" variant="outline" onClick={onAddNode} className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {templates.length > 0 && onAddTemplate && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Templates</h3>
              <div className="grid grid-cols-2 gap-2">
                {templates.map(template => (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:bg-accent transition-colors p-1"
                    onClick={() => onAddTemplate(template)}
                  >
                    <CardContent className="p-2 text-center">
                      <div 
                        className="w-full h-10 mb-1 rounded" 
                        style={{ 
                          backgroundColor: template.color,
                          borderRadius: template.shape === 'roundedRectangle' ? '8px' : 
                                        template.shape === 'circle' || template.shape === 'ellipse' ? '50%' : 
                                        '0px'
                        }}
                      />
                      <p className="text-xs font-medium">{template.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

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
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 left-0 z-10 h-7 w-7 bg-card shadow-md rounded-r-md rounded-l-none border-l-0"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    </>
  );
};

export default SidebarPanel;
