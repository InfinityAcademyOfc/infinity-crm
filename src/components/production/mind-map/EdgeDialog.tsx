
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edge } from "reactflow";

interface EdgeDialogProps {
  isOpen: boolean;
  edge: Edge | null;
  onClose: () => void;
  onUpdate: (source: string, target: string) => void;
  onDelete: () => void;
}

const EdgeDialog = ({ isOpen, edge, onClose, onUpdate, onDelete }: EdgeDialogProps) => {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");

  useEffect(() => {
    if (edge) {
      setSource(edge.source);
      setTarget(edge.target);
    }
  }, [edge]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg z-50 w-80">
      <h3 className="text-lg font-medium mb-4">Editar Conexão</h3>
      <div className="mb-2">
        <Label htmlFor="edge-source" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
      <div className="mb-4">
        <Label htmlFor="edge-target" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onDelete}>
          Deletar
        </Button>
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancelar
        </Button>
        <Button size="sm" onClick={() => onUpdate(source, target)}>
          Salvar
        </Button>
      </div>
    </div>
  );
};

export default EdgeDialog;
