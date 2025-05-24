
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Plus,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { ReactFlowProvider } from "reactflow";
import MindMapFlow from '../mind-map/MindMapFlow';
import "reactflow/dist/style.css";

interface AdvancedMindMapEditorProps {
  data: any;
  onChange: (data: any) => void;
  projectId: string;
}

export default function AdvancedMindMapEditor({ 
  data, 
  onChange, 
  projectId 
}: AdvancedMindMapEditorProps) {
  const [mindMapData, setMindMapData] = useState(data.nodes || [
    {
      id: '1',
      type: 'default',
      data: { label: 'Ideia Central' },
      position: { x: 400, y: 300 }
    }
  ]);
  const [edges, setEdges] = useState(data.edges || []);

  useEffect(() => {
    onChange({ 
      ...data, 
      nodes: mindMapData, 
      edges,
      version: (data.version || 1) + 1 
    });
  }, [mindMapData, edges]);

  const handleAddNode = () => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'default',
      data: { label: 'Nova Ideia' },
      position: { x: Math.random() * 400 + 200, y: Math.random() * 300 + 150 }
    };
    setMindMapData([...mindMapData, newNode]);
  };

  const handleReset = () => {
    setMindMapData([
      {
        id: '1',
        type: 'default',
        data: { label: 'Ideia Central' },
        position: { x: 400, y: 300 }
      }
    ]);
    setEdges([]);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b p-2 flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleAddNode}>
          <Plus className="h-4 w-4 mr-1" />
          Novo Nó
        </Button>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        <Button variant="ghost" size="sm">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Redo className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        <Button variant="ghost" size="sm">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Resetar
        </Button>
      </div>

      {/* Mind Map Canvas */}
      <div className="flex-1">
        <ReactFlowProvider>
          <MindMapFlow />
        </ReactFlowProvider>
      </div>

      {/* Side panel */}
      <div className="absolute right-4 top-16 w-64 bg-background border rounded-lg p-4 shadow-lg">
        <h3 className="font-medium mb-3">Propriedades</h3>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground">Nós: </span>
            <span>{mindMapData.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Conexões: </span>
            <span>{edges.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Projeto: </span>
            <span className="text-xs">{projectId}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t">
          <h4 className="font-medium mb-2 text-sm">Modelos</h4>
          <div className="space-y-1">
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              Brainstorming
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              Organograma
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              Fluxograma
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
