
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edge, MarkerType } from "reactflow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EdgeDialogProps, EdgeStyleData, MarkerData } from "./edge/types";
import BasicInfo from "./edge/BasicInfo";
import StyleControls from "./edge/StyleControls";
import MarkerControls from "./edge/MarkerControls";

const EdgeDialog = ({ isOpen, edge, onClose, onUpdate, onDelete }: EdgeDialogProps) => {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [strokeColor, setStrokeColor] = useState("#555555");
  const [strokeWidth, setStrokeWidth] = useState("2");
  const [strokeStyle, setStrokeStyle] = useState<"solid" | "dashed">("solid");
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
          ? edge.markerEnd as MarkerType
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

  const handleStyleChange = (styleData: EdgeStyleData) => {
    setStrokeColor(styleData.strokeColor);
    setStrokeWidth(styleData.strokeWidth);
    setStrokeStyle(styleData.strokeStyle);
  };

  const handleMarkerChange = (newMarkerStart: MarkerType | null, newMarkerEnd: MarkerType) => {
    setMarkerStart(newMarkerStart);
    setMarkerEnd(newMarkerEnd);
  };

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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">Editar Conexão</h3>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="style">Estilo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <BasicInfo
              source={source}
              target={target}
              onSourceChange={setSource}
              onTargetChange={setTarget}
            />
          </TabsContent>
          
          <TabsContent value="style" className="space-y-6">
            <StyleControls
              strokeColor={strokeColor}
              strokeWidth={strokeWidth}
              strokeStyle={strokeStyle}
              onStyleChange={handleStyleChange}
            />
            
            <MarkerControls
              markerStart={markerStart}
              markerEnd={markerEnd}
              strokeColor={strokeColor}
              onMarkerChange={handleMarkerChange}
            />
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
