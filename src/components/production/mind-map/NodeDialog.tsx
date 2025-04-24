
import { useState, useEffect } from "react";
import { Node, useReactFlow } from "reactflow";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  { value: "rectangle", label: "Rectangle" },
  { value: "roundedRect", label: "Rounded Rectangle" },
  { value: "circle", label: "Circle" },
  { value: "diamond", label: "Diamond" },
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
          
          // Update node styles based on shape
          let shapeStyles = {};
          if (nodeShape === "circle") {
            shapeStyles = { borderRadius: "50%" };
          } else if (nodeShape === "roundedRect") {
            shapeStyles = { borderRadius: "8px" };
          } else if (nodeShape === "diamond") {
            shapeStyles = { transform: "rotate(45deg)" };
          }
          
          node.style = {
            backgroundColor: nodeBgColor,
            color: nodeTextColor,
            borderColor: nodeBorderColor,
            borderWidth: "2px",
            ...shapeStyles,
          };
        }
        return node;
      })
    );
    
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Node</DialogTitle>
          <DialogDescription>
            Customize your mind map node. Make changes and click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nodeLabel" className="text-right">
              Label
            </Label>
            <Input
              id="nodeLabel"
              value={nodeLabel}
              onChange={(e) => setNodeLabel(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Node Shape</Label>
            <div className="col-span-3 flex gap-2">
              {nodeShapes.map((shape) => (
                <Button
                  key={shape.value}
                  type="button"
                  variant={nodeShape === shape.value ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setNodeShape(shape.value)}
                >
                  {shape.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Background</Label>
            <div className="col-span-3 flex flex-wrap gap-2">
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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Text Color</Label>
            <div className="col-span-3 flex gap-2">
              <button
                type="button"
                className={`w-8 h-8 rounded-full ${
                  nodeTextColor === "#FFFFFF" ? "ring-2 ring-offset-2 ring-primary" : ""
                }`}
                style={{ backgroundColor: "#FFFFFF" }}
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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Border Color</Label>
            <div className="col-span-3 flex gap-2">
              {nodeColors.slice(0, 4).map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    nodeBorderColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
                  }`}
                  style={{ borderColor: color }}
                  onClick={() => setNodeBorderColor(color)}
                />
              ))}
              <input 
                type="color"
                value={nodeBorderColor}
                onChange={(e) => setNodeBorderColor(e.target.value)}
                className="w-8 h-8 p-0 border-0"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nodeLink" className="text-right">
              Link URL
            </Label>
            <Input
              id="nodeLink"
              value={nodeLink}
              onChange={(e) => setNodeLink(e.target.value)}
              className="col-span-3"
              placeholder="https://"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={onDelete}>Delete Node</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NodeDialog;
