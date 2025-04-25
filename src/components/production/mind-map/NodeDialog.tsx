
import { useState, useEffect } from "react";
import { Node, useReactFlow } from "reactflow";
import { 
  Dialog,
  DialogContent,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface NodeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNode: Node | null;
  onDelete: () => void;
}

const nodeColors = [
  "#8B5CF6", // Vivid purple
  "#D946EF", // Magenta pink
  "#F97316", // Bright orange
  "#0EA5E9", // Ocean blue
  "#10B981", // Green
  "#EF4444", // Red
  "#6366F1", // Indigo
  "#F59E0B"  // Amber
];

const nodeShapes = [
  { value: "rectangle", label: "Retângulo" },
  { value: "roundedRect", label: "Retângulo Arredondado" },
  { value: "circle", label: "Círculo" },
  { value: "diamond", label: "Diamante" },
  { value: "highlight", label: "Destaque" },
  { value: "notepad", label: "Bloco de Notas" },
  { value: "funnel", label: "Funil" },
];

const NodeDialog = ({
  isOpen,
  onOpenChange,
  selectedNode,
  onDelete,
}: NodeDialogProps) => {
  const [nodeLabel, setNodeLabel] = useState("");
  const [nodeBgColor, setNodeBgColor] = useState("#8B5CF6");
  const [nodeTextColor, setNodeTextColor] = useState("#FFFFFF");
  const [nodeBorderColor, setNodeBorderColor] = useState("#6D28D9");
  const [nodeShape, setNodeShape] = useState("roundedRect");
  const [nodeLink, setNodeLink] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  
  const reactFlowInstance = useReactFlow();
  
  useEffect(() => {
    if (selectedNode) {
      setNodeLabel(selectedNode.data.label || "");
      setNodeBgColor(selectedNode.data.backgroundColor || "#8B5CF6");
      setNodeTextColor(selectedNode.data.textColor || "#FFFFFF");
      setNodeBorderColor(selectedNode.data.borderColor || "#6D28D9");
      setNodeShape(selectedNode.data.shape || "roundedRect");
      setNodeLink(selectedNode.data.link || "");
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (!selectedNode) return;
    
    reactFlowInstance.setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === selectedNode.id) {
          // Update node data with new values
          node.data = {
            ...node.data,
            label: nodeLabel,
            backgroundColor: nodeBgColor,
            textColor: nodeTextColor,
            borderColor: nodeBorderColor,
            shape: nodeShape,
            link: nodeLink,
          };
          
          return node;
        }
        return node;
      })
    );
    
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px] p-4 max-h-[90vh] overflow-y-auto">
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="appearance">Aparência</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="pt-4 space-y-3">
              <div className="space-y-1">
                <Label htmlFor="nodeLabel">Texto</Label>
                <Input
                  id="nodeLabel"
                  value={nodeLabel}
                  onChange={(e) => setNodeLabel(e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="nodeLink">URL (opcional)</Label>
                <Input
                  id="nodeLink"
                  value={nodeLink}
                  onChange={(e) => setNodeLink(e.target.value)}
                  placeholder="https://"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label>Forma</Label>
                <div className="grid grid-cols-2 gap-2 pb-2">
                  {nodeShapes.map((shape) => (
                    <Button
                      key={shape.value}
                      type="button"
                      variant={nodeShape === shape.value ? "default" : "outline"}
                      className="text-xs h-8"
                      onClick={() => setNodeShape(shape.value)}
                    >
                      {shape.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Fundo</Label>
                <div className="flex flex-wrap gap-2">
                  {nodeColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full ${
                        nodeBgColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNodeBgColor(color)}
                    />
                  ))}
                  <input 
                    type="color"
                    value={nodeBgColor}
                    onChange={(e) => setNodeBgColor(e.target.value)}
                    className="w-8 h-8 p-0 border-0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Texto</Label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`w-8 h-8 rounded-full ${
                        nodeTextColor === "#FFFFFF" ? "ring-2 ring-offset-2 ring-primary" : ""
                      }`}
                      style={{ backgroundColor: "#FFFFFF", border: "1px solid #ccc" }}
                      onClick={() => setNodeTextColor("#FFFFFF")}
                    />
                    <button
                      type="button"
                      className={`w-8 h-8 rounded-full ${
                        nodeTextColor === "#000000" ? "ring-2 ring-offset-2 ring-primary" : ""
                      }`}
                      style={{ backgroundColor: "#000000" }}
                      onClick={() => setNodeTextColor("#000000")}
                    />
                    <input 
                      type="color"
                      value={nodeTextColor}
                      onChange={(e) => setNodeTextColor(e.target.value)}
                      className="w-8 h-8 p-0 border-0"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Borda</Label>
                  <div className="flex gap-2">
                    <input 
                      type="color"
                      value={nodeBorderColor}
                      onChange={(e) => setNodeBorderColor(e.target.value)}
                      className="w-8 h-8 p-0 border-0"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="pt-2 flex gap-2 flex-row sm:justify-between">
          <Button variant="destructive" size="sm" onClick={onDelete}>Excluir</Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button size="sm" onClick={handleSave}>Salvar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NodeDialog;
