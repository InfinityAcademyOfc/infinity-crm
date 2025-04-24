
import { Button } from "@/components/ui/button";
import { RefreshCw, ZoomIn, ZoomOut, Plus } from "lucide-react";

export interface MindMapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onAddNode?: () => void;
}

const MindMapControls = ({ onZoomIn, onZoomOut, onFitView, onAddNode }: MindMapControlsProps) => {
  return (
    <div className="absolute bottom-20 right-4 z-10 flex flex-col gap-2">
      <Button 
        size="sm" 
        variant="secondary" 
        className="h-8 w-8 p-0 rounded-full shadow-md"
        onClick={onZoomIn}
      >
        <ZoomIn size={16} />
      </Button>
      <Button 
        size="sm" 
        variant="secondary" 
        className="h-8 w-8 p-0 rounded-full shadow-md"
        onClick={onZoomOut}
      >
        <ZoomOut size={16} />
      </Button>
      <Button 
        size="sm" 
        variant="secondary" 
        className="h-8 w-8 p-0 rounded-full shadow-md"
        onClick={onFitView}
      >
        <RefreshCw size={16} />
      </Button>
      {onAddNode && (
        <Button 
          size="sm" 
          variant="default" 
          className="h-8 w-8 p-0 rounded-full shadow-md bg-primary"
          onClick={onAddNode}
        >
          <Plus size={16} />
        </Button>
      )}
    </div>
  );
};

export default MindMapControls;
