
import { Node, Edge } from "reactflow";
import NodeDialog from "./NodeDialog";
import EdgeDialog from "./EdgeDialog";

interface NodeDialogsProps {
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  isNodeDialogOpen: boolean;
  isEdgeDialogOpen: boolean;
  setIsNodeDialogOpen: (open: boolean) => void;
  setIsEdgeDialogOpen: (open: boolean) => void;
  setNodes: (updater: any) => void;
  setEdges: (updater: any) => void;
}

const NodeDialogs = ({
  selectedNode,
  selectedEdge,
  isNodeDialogOpen,
  isEdgeDialogOpen,
  setIsNodeDialogOpen,
  setIsEdgeDialogOpen,
  setNodes,
  setEdges
}: NodeDialogsProps) => {
  
  const handleDeleteNode = () => {
    if (selectedNode) {
      setNodes((nodes: Node[]) => nodes.filter((node) => node.id !== selectedNode.id));
      setIsNodeDialogOpen(false);
    }
  };

  const handleDeleteEdge = () => {
    if (selectedEdge) {
      setEdges((edges: Edge[]) => edges.filter((edge) => edge.id !== selectedEdge.id));
      setIsEdgeDialogOpen(false);
    }
  };

  const handleUpdateEdge = (source: string, target: string, style: any, markerStart: any, markerEnd: any) => {
    if (selectedEdge) {
      setEdges((edges: Edge[]) => edges.map((edge) => 
        edge.id === selectedEdge.id ? { 
          ...edge, 
          source, 
          target,
          style,
          markerStart,
          markerEnd
        } : edge
      ));
      setIsEdgeDialogOpen(false);
    }
  };

  return (
    <>
      <NodeDialog
        isOpen={isNodeDialogOpen}
        onOpenChange={setIsNodeDialogOpen}
        selectedNode={selectedNode}
        onDelete={handleDeleteNode}
      />
      
      <EdgeDialog
        isOpen={isEdgeDialogOpen}
        edge={selectedEdge}
        onClose={() => setIsEdgeDialogOpen(false)}
        onUpdate={handleUpdateEdge}
        onDelete={handleDeleteEdge}
      />
    </>
  );
};

export default NodeDialogs;
