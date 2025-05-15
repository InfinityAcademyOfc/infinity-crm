
import { Edge, MarkerType } from "reactflow";

export interface EdgeDialogProps {
  isOpen: boolean;
  edge: Edge | null;
  onClose: () => void;
  onUpdate: (source: string, target: string, style: any, markerStart: any, markerEnd: any) => void;
  onDelete: () => void;
}

export interface EdgeStyleData {
  strokeColor: string;
  strokeWidth: string;
  strokeStyle: "solid" | "dashed";
}

export interface MarkerData {
  markerStart: MarkerType | null;
  markerEnd: MarkerType;
}

export interface BasicInfoProps {
  source: string;
  target: string;
  onSourceChange: (value: string) => void;
  onTargetChange: (value: string) => void;
}

export interface StyleControlsProps extends EdgeStyleData {
  onStyleChange: (style: EdgeStyleData) => void;
}

export interface MarkerControlsProps extends MarkerData {
  strokeColor: string;
  onMarkerChange: (markerStart: MarkerType | null, markerEnd: MarkerType) => void;
}
