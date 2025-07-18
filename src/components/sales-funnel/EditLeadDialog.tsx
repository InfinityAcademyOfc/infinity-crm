
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FunnelStage, SalesLead } from "@/services/api/funnelService";

interface EditLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeCard: SalesLead | null;
  funnelStages: FunnelStage[];
  onUpdate: (updates: Partial<SalesLead>) => void;
}

export const EditLeadDialog = ({
  open,
  onOpenChange,
  activeCard,
  funnelStages,
  onUpdate,
}: EditLeadDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    value: "",
    source: "",
    priority: "medium",
    stageId: ""
  });

  useEffect(() => {
    if (activeCard) {
      setFormData({
        name: activeCard.name || "",
        email: activeCard.email || "",
        phone: activeCard.phone || "",
        description: activeCard.description || "",
        value: activeCard.value ? activeCard.value.toString() : "",
        source: activeCard.source || "",
        priority: activeCard.priority || "medium",
        stageId: activeCard.stage_id || ""
      });
    }
  }, [activeCard]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSave = () => {
    const valueNumber = formData.value ? parseFloat(formData.value.replace(/\./g, "").replace(",", ".")) : 0;
    
    if (!formData.name) {
      return;
    }

    const updates: Partial<SalesLead> = {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      description: formData.description || undefined,
      value: valueNumber > 0 ? valueNumber : undefined,
      source: formData.source || undefined,
      priority: formData.priority,
    };

    // If stage changed, update it too
    if (formData.stageId !== activeCard?.stage_id) {
      const newStage = funnelStages.find(s => s.id === formData.stageId);
      if (newStage) {
        updates.stage_id = formData.stageId;
        updates.stage = newStage.name;
      }
    }
    
    onUpdate(updates);
    handleClose();
  };

  const formatCurrency = (value: string) => {
    let numericValue = value.replace(/\D/g, "");
    numericValue = numericValue.replace(/(\d)(\d{2})$/, "$1,$2");
    numericValue = numericValue.replace(/(?=(\d{3})+(\D))\B/g, ".");
    
    return numericValue ? `R$ ${numericValue}` : "";
  };

  const handleValueChange = (value: string) => {
    setFormData(prev => ({ ...prev, value }));
  };

  if (!activeCard) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Editar Lead</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4 overflow-y-auto max-h-[60vh]">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome / Empresa*</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome da empresa ou cliente"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="stage">Etapa do Funil</Label>
            <Select value={formData.stageId} onValueChange={(value) => setFormData(prev => ({ ...prev, stageId: value }))}>
              <SelectTrigger id="stage">
                <SelectValue placeholder="Selecione a etapa" />
              </SelectTrigger>
              <SelectContent>
                {funnelStages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detalhes sobre o lead"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="value">Valor Potencial</Label>
              <Input
                id="value"
                value={formatCurrency(formData.value)}
                onChange={(e) => handleValueChange(e.target.value)}
                placeholder="R$ 0,00"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Selecionar prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="source">Origem</Label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
              placeholder="Site, indicação, redes sociais..."
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!formData.name}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
