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
} from "reactflow";
import CustomNode from "./CustomNode";
import MindMapControls from "./MindMapControls";
import NodeTemplates, { nodeTemplates } from "./NodeTemplates";
import NodeEditButton from "./NodeEditButton";
import { initialNodes, initialEdges } from "./constants";
import SidebarPanel from "./SidebarPanel";
import NodeDialog from "./NodeDialog";
import EdgeDialog from "./EdgeDialog";
import NodeDialogs from "./NodeDialogs";

const nodeTypes = {
  custom: CustomNode,
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

  const handleNodeLabelChange = (id: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label: value } } : node
      )
    );
  };
  const handleNodeLabelEditDone = (id: string) => setEditingNodeId(null);

  const onConnect = useCallback((params: Connection) => {
    const newEdge = {
      ...params,
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#555', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#555' },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsNodeDialogOpen(true);
  };

  const enhancedNodes = nodes.map((node) => ({
    ...node,
    draggable: true,
    data: {
      ...node.data,
      isEditing: editingNodeId === node.id,
      onLabelChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        handleNodeLabelChange(node.id, e.target.value),
      onEditDone: () => handleNodeLabelEditDone(node.id),
      onStartEdit: () => setEditingNodeId(node.id),
      onEdit: () => {
        setSelectedNode(node);
        setIsNodeDialogOpen(true);
      },
    },
  }));

  const handleAddTemplateNode = (template: any) => {
    const position = reactFlowInstance.project({
      x: window.innerWidth / 2 - 100,
      y: window.innerHeight / 2 - 100
    });
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
      }
    };
    setNodes([...nodes, node]);
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
                shape: 'roundedRect',
              },
            };
            setNodes([...nodes, newNode]);
            setNodeName("");
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
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
          <MindMapControls 
            onZoomIn={() => reactFlowInstance.zoomIn()}
            onZoomOut={() => reactFlowInstance.zoomOut()}
            onFitView={() => reactFlowInstance.fitView()}
            onAddNode={() => { setEditingNodeId(null); }}
          />
          {showTemplates && (
            <NodeTemplates
              templates={templates}
              onAddTemplate={handleAddTemplateNode}
            />
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
