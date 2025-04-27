
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface NewProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewProductDialog = ({ open, onOpenChange }: NewProductDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    recurrence: "one-time",
    stock: "",
    description: ""
  });
  
  const [productType, setProductType] = useState<"product" | "service">("product");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically add the new product to your state or database
    console.log("New product:", formData);
    
    toast({
      title: "Produto adicionado",
      description: "O produto foi adicionado com sucesso.",
      duration: 2000
    });
    
    // Reset form and close dialog
    setFormData({
      name: "",
      category: "",
      price: "",
      recurrence: "one-time",
      stock: "",
      description: ""
    });
    setProductType("product");
    
    onOpenChange(false);
  };

  const handleTypeChange = (type: "product" | "service") => {
    setProductType(type);
    if (type === "service") {
      setFormData(prev => ({ ...prev, stock: "", category: "Serviço" }));
    } else {
      setFormData(prev => ({ ...prev, category: "Produto" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Produto/Serviço</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="flex gap-4 mb-4">
            <Button 
              type="button"
              variant={productType === "product" ? "default" : "outline"} 
              className="flex-1"
              onClick={() => handleTypeChange("product")}
            >
              Produto
            </Button>
            <Button 
              type="button"
              variant={productType === "service" ? "default" : "outline"} 
              className="flex-1"
              onClick={() => handleTypeChange("service")}
            >
              Serviço
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nome do produto"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder={productType === "product" ? "Produto" : "Serviço"}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recurrence">Recorrência</Label>
                <Select 
                  value={formData.recurrence} 
                  onValueChange={(value) => handleSelectChange("recurrence", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">Pagamento único</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="yearly">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {productType === "product" && (
                <div className="space-y-2">
                  <Label htmlFor="stock">Estoque</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Quantidade"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descrição do produto"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Adicionar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProductDialog;
