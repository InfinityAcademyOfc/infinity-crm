
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown } from "lucide-react";
import { TransactionType } from "@/types/finance";

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  initialType?: TransactionType;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialType = "income"
}) => {
  const [transactionType, setTransactionType] = useState<TransactionType>(initialType);
  const [confirmExitOpen, setConfirmExitOpen] = useState(false);

  const handleDialogClose = () => {
    setConfirmExitOpen(true);
  };

  const confirmExit = () => {
    setConfirmExitOpen(false);
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const data = {
      type: transactionType,
      description: formData.get("description") as string,
      amount: parseFloat(formData.get("amount") as string),
      category: formData.get("category") as string,
      date: formData.get("date") as string,
      client: formData.get("client") as string || null,
      status: "completed" as const,
      notes: formData.get("notes") as string || ""
    };

    try {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => {
        if (!open) {
          handleDialogClose();
        } else {
          onOpenChange(true);
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Transação</DialogTitle>
            <DialogDescription>
              Adicione uma nova receita ou despesa ao sistema.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={transactionType} onValueChange={(v) => setTransactionType(v as TransactionType)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="income" className="gap-2">
                <ArrowUp size={16} className="text-green-600" />
                Receita
              </TabsTrigger>
              <TabsTrigger value="expense" className="gap-2">
                <ArrowDown size={16} className="text-red-600" />
                Despesa
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição*</Label>
                  <Input 
                    id="description" 
                    name="description" 
                    placeholder={`Ex: ${transactionType === "income" ? "Pagamento de Cliente" : "Aluguel"}`}
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Valor (R$)*</Label>
                    <Input 
                      id="amount" 
                      name="amount" 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      placeholder="0,00" 
                      required 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="date">Data*</Label>
                    <Input 
                      id="date" 
                      name="date" 
                      type="date" 
                      defaultValue={new Date().toISOString().split('T')[0]} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoria*</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {transactionType === "income" ? (
                          <>
                            <SelectItem value="Vendas">Vendas</SelectItem>
                            <SelectItem value="Serviços">Serviços</SelectItem>
                            <SelectItem value="Consultoria">Consultoria</SelectItem>
                            <SelectItem value="Recorrente">Recorrente</SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="Pessoal">Pessoal</SelectItem>
                            <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Software">Software</SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {transactionType === "income" && (
                    <div className="grid gap-2">
                      <Label htmlFor="client">Cliente</Label>
                      <Select name="client">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Empresa ABC Ltda.">Empresa ABC Ltda.</SelectItem>
                          <SelectItem value="Consultoria XYZ">Consultoria XYZ</SelectItem>
                          <SelectItem value="Distribuidora Central">Distribuidora Central</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea 
                    id="notes" 
                    name="notes" 
                    placeholder="Informações adicionais sobre a transação..." 
                    rows={3} 
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {transactionType === "income" ? "Adicionar Receita" : "Adicionar Despesa"}
                </Button>
              </DialogFooter>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation dialog for exiting transaction form */}
      <Dialog open={confirmExitOpen} onOpenChange={setConfirmExitOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tem certeza que deseja sair?</DialogTitle>
            <DialogDescription>
              Se sair agora, todas as informações não salvas serão perdidas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setConfirmExitOpen(false)}>
              Não, continuar editando
            </Button>
            <Button type="button" variant="destructive" onClick={confirmExit}>
              Sim, sair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
