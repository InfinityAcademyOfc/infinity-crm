
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Brain, Calendar, Users } from 'lucide-react';

interface ProductionProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (projectData: {
    name: string;
    description: string;
    type: 'document' | 'mindmap' | 'kanban' | 'presentation';
  }) => Promise<void>;
}

const ProductionProjectDialog: React.FC<ProductionProjectDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'document' | 'mindmap' | 'kanban' | 'presentation'>('document');
  const [loading, setLoading] = useState(false);

  const projectTypes = [
    { value: 'document', label: 'Documento', icon: FileText },
    { value: 'mindmap', label: 'Mapa Mental', icon: Brain },
    { value: 'kanban', label: 'Kanban', icon: Calendar },
    { value: 'presentation', label: 'Apresentação', icon: Users }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onSuccess({
        name: name.trim(),
        description: description.trim(),
        type
      });
      
      // Reset form
      setName('');
      setDescription('');
      setType('document');
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Projeto de Produção</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Projeto</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do projeto"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o projeto (opcional)"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="type">Tipo de Projeto</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {projectTypes.map((projectType) => {
                  const Icon = projectType.icon;
                  return (
                    <SelectItem key={projectType.value} value={projectType.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {projectType.label}
                      </div>
                    </SelectItem>
                  );
                })}
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
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Criando...' : 'Criar Projeto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductionProjectDialog;
