
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KanbanColumnItem } from "./types";
import { cn } from "@/lib/utils";

interface KanbanColumnDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  columnTitle: string;
  setColumnTitle: (title: string) => void;
  columnColor: string;
  setColumnColor: (color: string) => void;
  onSave: () => void;
  isEdit?: boolean;
}

const KanbanColumnDialog = ({
  isOpen,
  onOpenChange,
  title,
  columnTitle,
  setColumnTitle,
  columnColor,
  setColumnColor,
  onSave,
  isEdit = false
}: KanbanColumnDialogProps) => {
  const colorOptions = [
    { light: "bg-gray-200", dark: "dark:bg-gray-700" },
    { light: "bg-blue-200", dark: "dark:bg-blue-800" },
    { light: "bg-green-200", dark: "dark:bg-green-800" },
    { light: "bg-red-200", dark: "dark:bg-red-800" },
    { light: "bg-yellow-200", dark: "dark:bg-yellow-800" },
    { light: "bg-purple-200", dark: "dark:bg-purple-800" },
    { light: "bg-pink-200", dark: "dark:bg-pink-800" },
    { light: "bg-indigo-200", dark: "dark:bg-indigo-800" },
  ];

  const handleColorSelect = (light: string) => {
    const dark = colorOptions.find(c => c.light === light)?.dark || "dark:bg-gray-700";
    setColumnColor(`${light} ${dark}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="columnTitle">Título da Coluna</Label>
            <Input 
              id="columnTitle" 
              value={columnTitle} 
              onChange={(e) => setColumnTitle(e.target.value)}
              placeholder={isEdit ? "" : "Ex: A Fazer, Em Progresso, Concluído"} 
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label>Cor da Coluna</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(({light, dark}) => (
                <div 
                  key={light}
                  className={cn(
                    `w-8 h-8 rounded-full ${light} cursor-pointer border-2`,
                    columnColor.includes(light) ? 'border-primary' : 'border-transparent'
                  )}
                  onClick={() => handleColorSelect(light)}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onSave}>{isEdit ? "Salvar" : "Adicionar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KanbanColumnDialog;
