
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BasicInfoProps } from "./types";

const BasicInfo = ({ source, target, onSourceChange, onTargetChange }: BasicInfoProps) => {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="edge-source" className="block text-sm font-medium">
          Origem:
        </Label>
        <Input
          type="text"
          id="edge-source"
          className="mt-1 text-xs"
          value={source}
          onChange={(e) => onSourceChange(e.target.value)}
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
          onChange={(e) => onTargetChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default BasicInfo;
