import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edge, MarkerType } from "reactflow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EdgeDialogProps {
  isOpen: boolean;
  edge: Edge | null;
  onClose: () => void;
  onUpdate: (source: string, target: string, style: any, markerStart: any, markerEnd: any) => void;
  onDelete: () => void;
}

const EdgeDialog = ({ isOpen, edge, onClose, onUpdate, onDelete }: EdgeDialogProps) => {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [strokeColor, setStrokeColor] = useState("#555555");
  const [strokeWidth, setStrokeWidth] = useState("2");
  const [strokeStyle, setStrokeStyle] = useState("solid");
  const [markerStart, setMarkerStart] = useState<MarkerType | null>(null);
  const [markerEnd, setMarkerEnd] = useState<MarkerType>(MarkerType.ArrowClosed);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (edge) {
      setSource(edge.source);
      setTarget(edge.target);
      
      if (edge.style) {
        setStrokeColor(edge.style.stroke || "#555555");
        setStrokeWidth(edge.style.strokeWidth?.toString() || "2");
        setStrokeStyle(edge.style.strokeDasharray ? "dashed" : "solid");
      }
      
      if (edge.markerEnd) {
        const markerEndType = typeof edge.markerEnd === 'string' 
          ? edge.markerEnd 
          : edge.markerEnd.type as MarkerType;
        setMarkerEnd(markerEndType || MarkerType.ArrowClosed);
      }
      
      if (edge.markerStart) {
        const markerStartType = typeof edge.markerStart === 'string'
          ? edge.markerStart as MarkerType
          : edge.markerStart.type as MarkerType;
        setMarkerStart(markerStartType);
      }
    }
  }, [edge]);

  if (!isOpen) return null;

  const handleSave = () => {
    const style = {
      stroke: strokeColor,
      strokeWidth: parseInt(strokeWidth),
      strokeDasharray: strokeStyle === "dashed" ? "5,5" : undefined,
    };

    const markerEndObj = markerEnd ? {
      type: markerEnd,
      color: strokeColor,
    } : null;
    
    const markerStartObj = markerStart ? {
      type: markerStart,
      color: strokeColor,
    } : null;
    
    onUpdate(source, target, style, markerStartObj, markerEndObj);
  };

  const handleMarkerChange = (value: string, setter: React.Dispatch<React.SetStateAction<MarkerType | null>>) => {
    if (value === "") {
      setter(() => null);
    } else if (value === MarkerType.Arrow || value === MarkerType.ArrowClosed) {
      setter(() => value as MarkerType);
    } else if (value === "circle") {
      setter(() => null);
    } else {
      setter(() => null);
    }
  };

  const markerOptions = [
    { label: "Nenhum", value: "" },
    { label: "Ponta de Seta", value: MarkerType.ArrowClosed },
    { label: "Seta", value: MarkerType.Arrow },
    { label: "Círculo", value: "circle" }
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">Editar Conexão</h3>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="style">Estilo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-3">
            <div>
              <Label htmlFor="edge-source" className="block text-sm font-medium">
                Origem:
              </Label>
              <Input
                type="text"
                id="edge-source"
                className="mt-1 text-xs"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edge-target" className="block text-sm font-medium">
                Destino:
              </Label>
              <Input
                type="text"
                id="edge-target"
                className="mt-1 text-xs"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="style" className="space-y-3">
            <div>
              <Label htmlFor="stroke-color" className="block text-sm font-medium">
                Cor da linha:
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="color"
                  id="stroke-color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="w-12 p-1 h-9"
                />
                <Input
                  type="text"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="stroke-width" className="block text-sm font-medium">
                Espessura:
              </Label>
              <Input
                type="number"
                id="stroke-width"
                min="1"
                max="10"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="stroke-style" className="block text-sm font-medium">
                Estilo da linha:
              </Label>
              <Select value={strokeStyle} onValueChange={setStrokeStyle}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Escolha o estilo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Sólida</SelectItem>
                  <SelectItem value="dashed">Tracejada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="marker-start" className="block text-sm font-medium">
                  Marcador inicial:
                </Label>
                <Select 
                  value={markerStart || ""} 
                  onValueChange={(val) => handleMarkerChange(val, setMarkerStart)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Escolha" />
                  </SelectTrigger>
                  <SelectContent>
                    {markerOptions.map(option => (
                      <SelectItem key={`start-${option.value}`} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="marker-end" className="block text-sm font-medium">
                  Marcador final:
                </Label>
                <Select 
                  value={markerEnd || ""} 
                  onValueChange={(val) => handleMarkerChange(val, setMarkerEnd)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Escolha" />
                  </SelectTrigger>
                  <SelectContent>
                    {markerOptions.map(option => (
                      <SelectItem key={`end-${option.value}`} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="destructive" size="sm" onClick={onDelete}>
            Deletar
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button size="sm" onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EdgeDialog;
