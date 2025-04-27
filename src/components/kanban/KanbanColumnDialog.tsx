
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  onSelectColumn
}: KanbanColumnDialogProps) => {
  const colors = [
    "bg-gray-200 dark:bg-gray-700",
    "bg-blue-200 dark:bg-blue-900",
    "bg-green-200 dark:bg-green-900",
    "bg-yellow-200 dark:bg-yellow-900",
    "bg-red-200 dark:bg-red-900",
    "bg-purple-200 dark:bg-purple-900",
    "bg-pink-200 dark:bg-pink-900",
    "bg-indigo-200 dark:bg-indigo-900",
    "bg-orange-200 dark:bg-orange-900",
  ];

  const handleSave = () => {
    if (onSave) onSave();
  };

  const isMoveDialog = targetColumns !== undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        {!isMoveDialog ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="column-title">Título da coluna</Label>
              <Input
                id="column-title"
                value={columnTitle}
                onChange={(e) => setColumnTitle?.(e.target.value)}
                placeholder="Digite o título da coluna"
                autoFocus
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Cor da coluna</Label>
              <RadioGroup
                value={columnColor}
                onValueChange={setColumnColor}
                className="grid grid-cols-3 gap-2"
              >
                {colors.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={color}
                      id={color}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={color}
                      className={`w-8 h-8 rounded cursor-pointer border-2 ${
                        columnColor === color
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent"
                      } ${color}`}
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Selecione a coluna de destino</Label>
              <RadioGroup
                onValueChange={(value) => onSelectColumn?.(value)}
                className="grid gap-2"
              >
                {targetColumns.map((column) => (
                  <div key={column.id} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={column.id}
                      id={column.id}
                    />
                    <Label
                      htmlFor={column.id}
                      className="flex items-center cursor-pointer"
                    >
                      <div className={`w-4 h-4 rounded mr-2 ${column.color || "bg-gray-200"}`}></div>
                      {column.title}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          {!isMoveDialog ? (
            <Button onClick={handleSave} disabled={!columnTitle?.trim()}>
              {isEdit ? "Salvar" : "Adicionar"}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KanbanColumnDialog;
