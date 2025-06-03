
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Move, 
  Circle,
  Square,
  Triangle,
  Brain,
  Network
} from 'lucide-react';
import { ProductionProject } from '@/hooks/useProductionWorkspace';

interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
  children: string[];
  parent?: string;
}

interface MindMapEditorProps {
  project: ProductionProject;
  onUpdate: (id: string, updates: Partial<ProductionProject>) => Promise<ProductionProject | null>;
}

const MindMapEditor: React.FC<MindMapEditorProps> = ({ project, onUpdate }) => {
  const [nodes, setNodes] = useState<MindMapNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (project.data?.nodes) {
      setNodes(project.data.nodes);
    } else {
      // Criar nó central padrão
      const defaultNode: MindMapNode = {
        id: '1',
        text: 'Ideia Central',
        x: 300,
        y: 200,
        color: '#3b82f6',
        shape: 'circle',
        children: []
      };
      setNodes([defaultNode]);
    }
  }, [project]);

  const saveNodes = async (newNodes: MindMapNode[]) => {
    await onUpdate(project.id, {
      data: {
        ...project.data,
        nodes: newNodes
      }
    });
  };

  const addNode = () => {
    const newNode: MindMapNode = {
      id: Date.now().toString(),
      text: 'Nova Ideia',
      x: Math.random() * 500 + 100,
      y: Math.random() * 300 + 100,
      color: '#10b981',
      shape: 'circle',
      children: [],
      parent: selectedNode || undefined
    };

    const updatedNodes = [...nodes, newNode];
    
    // Se há um nó selecionado, adicionar como filho
    if (selectedNode) {
      const parentIndex = updatedNodes.findIndex(n => n.id === selectedNode);
      if (parentIndex !== -1) {
        updatedNodes[parentIndex].children.push(newNode.id);
      }
    }

    setNodes(updatedNodes);
    saveNodes(updatedNodes);
  };

  const deleteNode = (nodeId: string) => {
    const updatedNodes = nodes.filter(n => n.id !== nodeId);
    // Remover referências dos pais
    updatedNodes.forEach(node => {
      node.children = node.children.filter(childId => childId !== nodeId);
    });
    
    setNodes(updatedNodes);
    saveNodes(updatedNodes);
    setSelectedNode(null);
  };

  const startEdit = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setEditingNode(nodeId);
      setEditText(node.text);
    }
  };

  const saveEdit = () => {
    if (editingNode) {
      const updatedNodes = nodes.map(node =>
        node.id === editingNode ? { ...node, text: editText } : node
      );
      setNodes(updatedNodes);
      saveNodes(updatedNodes);
      setEditingNode(null);
      setEditText('');
    }
  };

  const changeNodeColor = (nodeId: string, color: string) => {
    const updatedNodes = nodes.map(node =>
      node.id === nodeId ? { ...node, color } : node
    );
    setNodes(updatedNodes);
    saveNodes(updatedNodes);
  };

  const changeNodeShape = (nodeId: string, shape: 'circle' | 'square' | 'triangle') => {
    const updatedNodes = nodes.map(node =>
      node.id === nodeId ? { ...node, shape } : node
    );
    setNodes(updatedNodes);
    saveNodes(updatedNodes);
  };

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
        <Button
          onClick={addNode}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Nó
        </Button>
        
        {selectedNode && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => startEdit(selectedNode)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteNode(selectedNode)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </>
        )}
        
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Brain className="h-3 w-3 mr-1" />
            {nodes.length} nós
          </Badge>
        </div>
      </div>

      {/* Mind Map Canvas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Mapa Mental
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative border-2 border-dashed border-gray-200 rounded-lg" style={{ height: '500px' }}>
            <svg className="absolute inset-0 w-full h-full">
              {/* Renderizar conexões */}
              {nodes.map(node => 
                node.children.map(childId => {
                  const child = nodes.find(n => n.id === childId);
                  if (!child) return null;
                  
                  return (
                    <line
                      key={`${node.id}-${childId}`}
                      x1={node.x + 50}
                      y1={node.y + 25}
                      x2={child.x + 50}
                      y2={child.y + 25}
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />
                  );
                })
              )}
            </svg>
            
            {/* Renderizar nós */}
            {nodes.map(node => (
              <div
                key={node.id}
                className={`absolute cursor-pointer transition-all ${
                  selectedNode === node.id ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  left: node.x,
                  top: node.y,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setSelectedNode(node.id)}
              >
                {editingNode === node.id ? (
                  <div className="bg-white border rounded-lg p-2 shadow-lg">
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') setEditingNode(null);
                      }}
                      onBlur={saveEdit}
                      className="w-32 h-8 text-xs"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div
                    className="bg-white border-2 rounded-lg p-3 shadow-md min-w-[100px] text-center"
                    style={{ borderColor: node.color }}
                  >
                    {node.shape === 'circle' && <Circle className="h-4 w-4 mx-auto mb-1" style={{ color: node.color }} />}
                    {node.shape === 'square' && <Square className="h-4 w-4 mx-auto mb-1" style={{ color: node.color }} />}
                    {node.shape === 'triangle' && <Triangle className="h-4 w-4 mx-auto mb-1" style={{ color: node.color }} />}
                    <div className="text-xs font-medium">{node.text}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Node Properties */}
      {selectedNode && (
        <Card>
          <CardHeader>
            <CardTitle>Propriedades do Nó</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Cor</label>
              <div className="flex gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: color }}
                    onClick={() => changeNodeColor(selectedNode, color)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2">Formato</label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changeNodeShape(selectedNode, 'circle')}
                >
                  <Circle className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changeNodeShape(selectedNode, 'square')}
                >
                  <Square className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changeNodeShape(selectedNode, 'triangle')}
                >
                  <Triangle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MindMapEditor;
