
import React, { useState } from "react";
import { FileText, Upload, FileSpreadsheet, FileVideo, File } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ImportDocumentDialogProps {
  onImport?: (file: File, type: string) => void;
}

const ImportDocumentDialog: React.FC<ImportDocumentDialogProps> = ({ onImport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState("document");
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!file) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo para importar.",
        variant: "destructive",
      });
      return;
    }

    if (onImport) {
      onImport(file, fileType);
    } else {
      // Demo mode - just show a success toast
      toast({
        title: "Documento importado",
        description: `O arquivo ${file.name} foi importado com sucesso.`,
      });
    }

    setIsOpen(false);
    setFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Upload size={16} />
          <span>Importar Documento</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Documento</DialogTitle>
          <DialogDescription>
            Selecione um documento para importar no sistema.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div 
            className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer ${fileType === 'document' ? 'bg-primary/10 border-primary' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            onClick={() => setFileType('document')}
          >
            <FileText className="h-8 w-8 mb-2 text-primary" />
            <span className="text-sm font-medium">Documento</span>
            <span className="text-xs text-muted-foreground mt-1">.doc, .docx, .pdf, .txt</span>
          </div>
          
          <div 
            className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer ${fileType === 'spreadsheet' ? 'bg-primary/10 border-primary' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            onClick={() => setFileType('spreadsheet')}
          >
            <FileSpreadsheet className="h-8 w-8 mb-2 text-green-600" />
            <span className="text-sm font-medium">Planilha</span>
            <span className="text-xs text-muted-foreground mt-1">.xls, .xlsx, .csv</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="file" className="text-sm">
            Selecione ou arraste um arquivo
          </Label>
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
            className="cursor-pointer"
            accept=".doc,.docx,.pdf,.txt,.xls,.xlsx,.csv"
          />
          {file && (
            <p className="text-xs text-muted-foreground">
              Arquivo selecionado: {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={!file}>
            Importar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDocumentDialog;
