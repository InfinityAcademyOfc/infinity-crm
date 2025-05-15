import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { KanbanColumnItem } from "./types";

interface KanbanColumnDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  columnTitle?: string;
  columnColor?: string;
  setColumnTitle?: (title: string) => void;
  setColumnColor?: (color: string) => void;
  onSave?: () => void;
  isEdit?: boolean;
  targetColumns?: KanbanColumnItem[];
  onSelectColumn?: (columnId: string) => void;
}

const columnColors = [
  { id: "bg-gray-200 dark:bg-gray-700", name: "Cinza", light: "#E5E7EB", dark: "#374151" },
  { id: "bg-blue-200 dark:bg-blue-900", name: "Azul", light: "#BFDBFE", dark: "#1E3A8A" },
  { id: "bg-green-200 dark:bg-green-900", name: "Verde", light: "#A7F3D0", dark: "#064E3B" },
  { id: "bg-yellow-200 dark:bg-yellow-900", name: "Amarelo", light: "#FEF08A", dark: "#713F12" },
  { id: "bg-red-200 dark:bg-red-900", name: "Vermelho", light: "#FECACA", dark: "#7F1D1D" },
  { id: "bg-purple-200 dark:bg-purple-900", name: "Roxo", light: "#DDD6FE", dark: "#581C87" },
  { id: "bg-pink-200 dark:bg-pink-900", name: "Rosa", light: "#FBCFE8", dark: "#831843" },
  { id: "bg-indigo-200 dark:bg-indigo-900", name: "Índigo", light: "#C7D2FE", dark: "#312E81" },
  { id: "bg-orange-200 dark:bg-orange-900", name: "Laranja", light: "#FED7AA", dark: "#7C2D12" },
  { id: "bg-teal-200 dark:bg-teal-900", name: "Teal", light: "#99F6E4", dark: "#134E4A" },
];

const kanbanTypes = [
  { id: "sales", name: "Vendas" },
  { id: "ltv", name: "LTV" },
  { id: "production", name: "Produção" },
  { id: "tasks", name: "Tarefas" }
];

const KanbanColumnDialog = ({
  isOpen,
  onOpenChange,
  title,
  columnTitle = "",
  columnColor = "bg-gray-200 dark:bg-gray-700",
  setColumnTitle,
  setColumnColor,
  onSave,
  isEdit = false,
  targetColumns,
  onSelectColumn,
}: KanbanColumnDialogProps) => {
  const [selectedTargetColumn, setSelectedTargetColumn] = useState<string | null>(null);
  const [selectedKanbanType, setSelectedKanbanType] = useState<string | null>(null);
  const [showKanbanTypes, setShowKanbanTypes] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedTargetColumn(null);
      setSelectedKanbanType(null);
      setShowKanbanTypes(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (targetColumns && onSelectColumn && selectedTargetColumn) {
      onSelectColumn(selectedTargetColumn);
    } else if (onSave) {
      onSave();
    }
  };

  if (targetColumns && onSelectColumn) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          {!showKanbanTypes ? (
            <>
              <div className="space-y-4 py-2 max-h-[400px] overflow-y-auto">
                <RadioGroup
                  value={selectedTargetColumn || ""}
                  onValueChange={setSelectedTargetColumn}
                >
                  {targetColumns.map((column) => (
                    <div key={column.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={column.id} id={`column-${column.id}`} />
                      <Label htmlFor={`column-${column.id}`} className="flex-1 cursor-pointer">
                        {column.title}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => setShowKanbanTypes(true)}
                >
                  Enviar para outro Kanban
                </Button>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleSave} disabled={!selectedTargetColumn}>
                  Mover
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="space-y-4 py-2">
                <RadioGroup
                  value={selectedKanbanType || ""}
                  onValueChange={setSelectedKanbanType}
                >
                  {kanbanTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={type.id} id={`type-${type.id}`} />
                      <Label htmlFor={`type-${type.id}`} className="flex-1 cursor-pointer">
                        Kanban de {type.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowKanbanTypes(false)}
                >
                  Voltar
                </Button>
                <Button 
                  type="button" 
                  onClick={() => {
                    alert(`Movendo para o Kanban de ${
                      kanbanTypes.find(t => t.id === selectedKanbanType)?.name || ''
                    }. Essa funcionalidade será implementada em breve.`);
                    onOpenChange(false);
                  }} 
                  disabled={!selectedKanbanType}
                >
                  Mover
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="column-title">Título</Label>
            <Input
              id="column-title"
              value={columnTitle}
              onChange={(e) => setColumnTitle && setColumnTitle(e.target.value)}
              placeholder="Ex: Prospecção"
            />
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="grid grid-cols-5 gap-2">
              {columnColors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setColumnColor && setColumnColor(color.id)}
                  className={`w-full h-10 rounded-md border-2 transition-all ${
                    columnColor === color.id
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  style={{
                    backgroundImage: `linear-gradient(to bottom, ${color.light}, ${color.dark})`,
                  }}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            {isEdit ? "Salvar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KanbanColumnDialog;
