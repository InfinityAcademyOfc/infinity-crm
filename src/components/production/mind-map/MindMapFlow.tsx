
import { useState, useCallback, useRef } from "react";
import ReactFlow, { 
  Controls, 
  Background, 
  BackgroundVariant, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Node, 
  Edge, 
  Connection, 
  MarkerType, 
  useReactFlow, 
  Panel, 
  ConnectionLineType,
  MiniMap
} from "reactflow";
import { Button } from "@/components/ui/button";
import CustomNode from "./CustomNode";
import MindMapControls from "./MindMapControls";
import NodeTemplates, { nodeTemplates } from "./NodeTemplates";
import SidebarPanel from "./SidebarPanel";
import NodeDialogs from "./NodeDialogs";
import { useToast } from "@/hooks/use-toast";

// Initial empty state
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];
const nodeTypes = {
  custom: CustomNode
};

const MindMapFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [isNodeDialogOpen, setIsNodeDialogOpen] = useState(false);
  const [isEdgeDialogOpen, setIsEdgeDialogOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [nodeName, setNodeName] = useState("");
  const editingNodeRef = useRef<Node | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const templates = nodeTemplates;
  const reactFlowInstance = useReactFlow();
  const { toast } = useToast();

  const handleNodeLabelChange = (id: string, value: string) => {
    setNodes(nds => nds.map(node => node.id === id ? {
      ...node,
      data: {
        ...node.data,
        label: value
      }
    } : node));
  };

  const handleNodeLabelEditDone = (id: string) => setEditingNodeId(null);

  const handleNodeResize = (id: string, width: number, height: number) => {
    setNodes(nds => nds.map(node => node.id === id ? {
      ...node,
      style: {
        ...node.style,
        width: `${width}px`,
        height: `${height}px`
      }
    } : node));
  };

  const onConnect = useCallback((params: Connection) => {
    // Create a new edge with default styling
    const newEdge = {
      ...params,
      type: 'default',
      animated: false,
      style: {
        stroke: '#555',
        strokeWidth: 2
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#555'
      }
    };

    // Add the edge to the flow
    setEdges(eds => addEdge(newEdge, eds));
    toast({
      description: "Conexão criada com sucesso!",
      duration: 2000
    });
  }, [setEdges, toast]);

  const enhancedNodes = nodes.map(node => ({
    ...node,
    draggable: true,
    connectable: true, // Garantindo que os nós sejam conectáveis
    data: {
      ...node.data,
      isEditing: editingNodeId === node.id,
      onLabelChange: (e: React.ChangeEvent<HTMLInputElement>) => handleNodeLabelChange(node.id, e.target.value),
      onEditDone: () => handleNodeLabelEditDone(node.id),
      onStartEdit: () => setEditingNodeId(node.id),
      onEdit: () => {
        setSelectedNode(node);
        setIsNodeDialogOpen(true);
      },
      onResize: (width: number, height: number) => handleNodeResize(node.id, width, height)
    }
  }));

  const handleAddTemplateNode = (template: any) => {
    const position = reactFlowInstance.project({
      x: window.innerWidth / 2 - 100,
      y: window.innerHeight / 2 - 100
    });
    
    // Criar vários nós conectados (quando é um template complexo)
    if (template.nodes && Array.isArray(template.nodes)) {
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];
      const baseId = `node-group-${Date.now()}`;
      
      // Criar os nós
      template.nodes.forEach((nodeConfig: any, index: number) => {
        const nodeId = `${baseId}-${index}`;
        const node: Node = {
          id: nodeId,
          type: "custom",
          position: {
            x: position.x + (nodeConfig.offsetX || 0),
            y: position.y + (nodeConfig.offsetY || 0)
          },
          data: {
            label: nodeConfig.label || template.name,
            backgroundColor: nodeConfig.color || template.color,
            shape: nodeConfig.shape || template.shape,
            textColor: "#222",
            borderColor: "#999"
          },
          style: {
            width: 120,
            height: 60
          }
        };
        newNodes.push(node);
      });
      
      // Criar as conexões entre os nós
      if (template.connections) {
        template.connections.forEach((connection: any, index: number) => {
          const edge: Edge = {
            id: `edge-${baseId}-${index}`,
            source: `${baseId}-${connection.source}`,
            target: `${baseId}-${connection.target}`,
            type: 'default',
            animated: false,
            style: {
              stroke: connection.color || '#555',
              strokeWidth: connection.width || 2
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: connection.color || '#555'
            }
          };
          newEdges.push(edge);
        });
      }
      
      setNodes(prevNodes => [...prevNodes, ...newNodes]);
      setEdges(prevEdges => [...prevEdges, ...newEdges]);
      
      toast({
        description: `Template "${template.name}" adicionado com ${newNodes.length} nós!`,
        duration: 2000
      });
    } else {
      // Adicionar um único nó (comportamento original)
      const node: Node = {
        id: `node-${Date.now()}`,
        type: "custom",
        position,
        data: {
          label: template.name,
          backgroundColor: template.color,
          shape: template.shape,
          textColor: "#222",
          borderColor: "#999"
        },
        style: {
          width: 120,
          height: 60
        }
      };
      setNodes([...nodes, node]);
      toast({
        description: `Nó "${template.name}" adicionado!`,
        duration: 2000
      });
    }
  };

  return (
    <div className="w-full h-full flex" style={{ height: '842px' }}>
      <SidebarPanel 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        nodeName={nodeName} 
        setNodeName={setNodeName} 
        onAddNode={() => {
          if (nodeName.trim()) {
            const position = reactFlowInstance.project({
              x: window.innerWidth / 2 - 100,
              y: window.innerHeight / 2 - 100
            });
            const newNode = {
              id: `node-${Date.now()}`,
              type: 'custom',
              position,
              data: {
                label: nodeName,
                backgroundColor: '#8B5CF6',
                textColor: '#FFFFFF',
                borderColor: '#6D28D9',
                shape: 'roundedRect'
              },
              style: {
                width: 120,
                height: 60
              }
            };
            setNodes([...nodes, newNode]);
            setNodeName("");
            toast({
              description: `Nó "${nodeName}" adicionado!`,
              duration: 2000
            });
          }
        }} 
        templates={templates} 
        onAddTemplate={handleAddTemplateNode} 
      />
      
      <div className="w-full h-full relative">
        <ReactFlow 
          nodes={enhancedNodes} 
          nodeTypes={nodeTypes} 
          edges={edges} 
          onNodesChange={onNodesChange} 
          onEdgesChange={onEdgesChange} 
          onConnect={onConnect} 
          onNodeClick={(_, node) => {
            if (!node.data?.onEdit) {
              setEditingNodeId(node.id);
            }
            setSelectedNode(node);
          }} 
          onEdgeClick={(_, edge) => {
            setSelectedEdge(edge);
            setIsEdgeDialogOpen(true);
          }} 
          fitView 
          snapToGrid 
          snapGrid={[15, 15]} 
          defaultViewport={{
            x: 0,
            y: 0,
            zoom: 0.8
          }} 
          connectionLineStyle={{
            stroke: '#555',
            strokeWidth: 2
          }} 
          connectionLineType={ConnectionLineType.SmoothStep}
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
          <MiniMap 
            nodeStrokeWidth={3}
            nodeColor={(node) => {
              return node.data.backgroundColor || '#8B5CF6';
            }}
          />
          <MindMapControls 
            onZoomIn={() => reactFlowInstance.zoomIn()} 
            onZoomOut={() => reactFlowInstance.zoomOut()} 
            onFitView={() => reactFlowInstance.fitView()} 
            onAddNode={() => {
              setEditingNodeId(null);
            }} 
          />
          
          {showTemplates && (
            <Panel position="top-center" className="bg-white dark:bg-gray-800 p-3 rounded shadow-md">
              <NodeTemplates templates={templates} onAddTemplate={handleAddTemplateNode} />
            </Panel>
          )}
        </ReactFlow>
        
        <NodeDialogs 
          selectedNode={selectedNode} 
          selectedEdge={selectedEdge} 
          isNodeDialogOpen={isNodeDialogOpen} 
          isEdgeDialogOpen={isEdgeDialogOpen} 
          setIsNodeDialogOpen={setIsNodeDialogOpen} 
          setIsEdgeDialogOpen={setIsEdgeDialogOpen} 
          setNodes={setNodes} 
          setEdges={setEdges} 
        />
      </div>
    </div>
  );
};

export default MindMapFlow;
