
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StyleControlsProps } from "./types";

const StyleControls = ({ strokeColor, strokeWidth, strokeStyle, onStyleChange }: StyleControlsProps) => {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="stroke-color" className="block text-sm font-medium">
          Cor da linha:
        </Label>
        <div className="flex gap-2 mt-1">
          <Input
            type="color"
            id="stroke-color"
            value={strokeColor}
            onChange={(e) => onStyleChange({ strokeColor: e.target.value, strokeWidth, strokeStyle })}
            className="w-12 p-1 h-9"
          />
          <Input
            type="text"
            value={strokeColor}
            onChange={(e) => onStyleChange({ strokeColor: e.target.value, strokeWidth, strokeStyle })}
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
          onChange={(e) => onStyleChange({ strokeColor, strokeWidth: e.target.value, strokeStyle })}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="stroke-style" className="block text-sm font-medium">
          Estilo da linha:
        </Label>
        <Select 
          value={strokeStyle} 
          onValueChange={(value: "solid" | "dashed") => 
            onStyleChange({ strokeColor, strokeWidth, strokeStyle: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Escolha o estilo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Sólida</SelectItem>
            <SelectItem value="dashed">Tracejada</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StyleControls;
