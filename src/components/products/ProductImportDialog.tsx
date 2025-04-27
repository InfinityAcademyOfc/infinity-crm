
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductImportDialog = ({ open, onOpenChange }: ProductImportDialogProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };
  
  const handleImport = () => {
    if (!file) return;
    
    toast({
      title: "Produtos exportados",
      description: "Lista de produtos exportada com sucesso.",
      duration: 2000
    });
    
    setFile(null);
    onOpenChange(false);
  };

  const mockExportCsv = () => {
    // Create a CSV string
    const csvContent = 
      "id,name,category,price,recurrence,stock,description\n" +
      "1,Sistema ERP Completo,Software,12000,yearly,,Sistema completo de gestão empresarial\n" +
      "2,Consultoria Estratégica,Serviço,5000,one-time,,Análise completa do negócio\n" +
      "3,Marketing Digital,Serviço,2500,monthly,,Gestão completa de campanhas\n";
    
    // Create a blob and download it
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "produtos_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Template baixado",
      description: "Modelo de CSV para importação baixado.",
      duration: 2000
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Exportar Produtos</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Exporte todos os produtos para um arquivo CSV para usar em outras aplicações.
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-4">
            <Button 
              onClick={mockExportCsv}
              variant="outline"
              className="w-full"
            >
              Exportar Produtos
            </Button>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Modelo para importação</h3>
            <Button
              onClick={mockExportCsv}
              variant="secondary"
              className="w-full"
            >
              Baixar modelo CSV
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductImportDialog;
