
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarkerType } from "reactflow";
import { MarkerControlsProps } from "./types";

const MarkerControls = ({ markerStart, markerEnd, strokeColor, onMarkerChange }: MarkerControlsProps) => {
  const handleMarkerChange = (value: string, isStart: boolean) => {
    let newMarker: MarkerType | null = null;
    
    if (value !== "none") {
      if (Object.values(MarkerType).includes(value as any)) {
        newMarker = value as MarkerType;
      } else if (value === "circle") {
        newMarker = "circle" as unknown as MarkerType;
      }
    }
    
    onMarkerChange(
      isStart ? newMarker : markerStart,
      isStart ? markerEnd : (newMarker || MarkerType.ArrowClosed)
    );
  };

  const markerOptions = [
    { label: "Nenhum", value: "none" },
    { label: "Ponta de Seta", value: MarkerType.ArrowClosed },
    { label: "Seta", value: MarkerType.Arrow },
    { label: "Círculo", value: "circle" }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="marker-start" className="block text-sm font-medium">
          Marcador inicial:
        </Label>
        <Select 
          value={markerStart || "none"} 
          onValueChange={(val) => handleMarkerChange(val, true)}
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
          value={markerEnd || "none"} 
          onValueChange={(val) => handleMarkerChange(val, false)}
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
  );
};

export default MarkerControls;
