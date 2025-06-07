
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Brain, Kanban, Presentation } from 'lucide-react';
import { ProductionProject, ProductionFolder } from '@/hooks/useProductionWorkspace';

interface ProductionProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (data: Partial<ProductionProject>) => void;
  folders: ProductionFolder[];
}

const projectTypes = [
  {
    type: 'document',
    label: 'Documento',
    description: 'Editor de texto rico com colaboração em tempo real',
    icon: FileText
  },
  {
    type: 'mindmap',
    label: 'Mind Map',
    description: 'Mapa mental interativo para brainstorming',
    icon: Brain
  },
  {
    type: 'kanban',
    label: 'Kanban',
    description: 'Quadro kanban para gestão de tarefas',
    icon: Kanban
  },
  {
    type: 'presentation',
    label: 'Apresentação',
    description: 'Criador de apresentações profissionais',
    icon: Presentation
  }
];

export default function ProductionProjectDialog({
  open,
  onOpenChange,
  onCreateProject,
  folders
}: ProductionProjectDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'document' as ProductionProject['type'],
    folder_id: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    const projectData: Partial<ProductionProject> = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      type: formData.type,
      status: 'draft',
      folder_id: formData.folder_id || undefined,
      data: getInitialData(formData.type)
    };

    onCreateProject(projectData);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      type: 'document',
      folder_id: ''
    });
  };

  const getInitialData = (type: ProductionProject['type']) => {
    switch (type) {
      case 'document':
        return {
          content: '',
          version: 1
        };
      case 'mindmap':
        return {
          nodes: [
            {
              id: '1',
              type: 'default',
              data: { label: 'Ideia Central' },
              position: { x: 400, y: 300 }
            }
          ],
          edges: []
        };
      case 'kanban':
        return {
          columns: [
            { id: 'todo', title: 'Para Fazer', tasks: [] },
            { id: 'doing', title: 'Fazendo', tasks: [] },
            { id: 'done', title: 'Concluído', tasks: [] }
          ]
        };
      case 'presentation':
        return {
          slides: [
            {
              id: '1',
              title: 'Slide 1',
              content: '',
              layout: 'title'
            }
          ],
          theme: 'default'
        };
      default:
        return {};
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Projeto</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Digite o nome do projeto..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o objetivo do projeto..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="folder">Pasta (opcional)</Label>
            <Select
              value={formData.folder_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, folder_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma pasta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhuma pasta</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Tipo de Projeto</Label>
            <div className="grid grid-cols-2 gap-3">
              {projectTypes.map((projectType) => {
                const IconComponent = projectType.icon;
                return (
                  <div
                    key={projectType.type}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.type === projectType.type
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, type: projectType.type as ProductionProject['type'] }))}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">{projectType.label}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {projectType.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Projeto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
