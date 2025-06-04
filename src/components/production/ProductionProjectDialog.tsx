
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Brain, Kanban, Presentation } from 'lucide-react';
import { toast } from 'sonner';

interface ProductionProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (projectData: {
    name: string;
    description: string;
    type: 'document' | 'mindmap' | 'kanban' | 'presentation';
  }) => Promise<void>;
}

const ProductionProjectDialog = ({ open, onOpenChange, onSuccess }: ProductionProjectDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'document' as 'document' | 'mindmap' | 'kanban' | 'presentation'
  });
  const [loading, setLoading] = useState(false);

  const projectTypes = [
    { value: 'document', label: 'Documento', icon: FileText },
    { value: 'mindmap', label: 'Mapa Mental', icon: Brain },
    { value: 'kanban', label: 'Kanban', icon: Kanban },
    { value: 'presentation', label: 'Apresentação', icon: Presentation }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Nome do projeto é obrigatório');
      return;
    }

    setLoading(true);
    try {
      if (onSuccess) {
        await onSuccess(formData);
      }
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        type: 'document'
      });
      
      onOpenChange(false);
      toast.success('Projeto criado com sucesso!');
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast.error(error.message || 'Erro ao criar projeto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Projeto</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Digite o nome do projeto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva brevemente o projeto"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de Projeto</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'document' | 'mindmap' | 'kanban' | 'presentation') => 
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {projectTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Projeto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductionProjectDialog;
