
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, FileText, Users, Calendar, Settings } from 'lucide-react';
import { useProductionWorkspace } from '@/hooks/useProductionWorkspace';
import { toast } from 'sonner';

const ProductionEditor = () => {
  const { 
    activeProject, 
    updateProject 
  } = useProductionWorkspace();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activeProject) {
      setTitle(activeProject.name);
      setDescription(activeProject.description || '');
    }
  }, [activeProject]);

  const handleSave = async () => {
    if (!activeProject) return;
    
    setIsSaving(true);
    try {
      await updateProject(activeProject.id, {
        name: title,
        description
      });
      toast.success('Projeto salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      toast.error('Erro ao salvar projeto');
    } finally {
      setIsSaving(false);
    }
  };

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Selecione um projeto para editar</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Rascunho</Badge>;
      case 'in_progress':
        return <Badge variant="default">Em Andamento</Badge>;
      case 'review':
        return <Badge variant="outline">Em Revisão</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Concluído</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'mindmap':
        return <Settings className="h-4 w-4" />;
      case 'kanban':
        return <Calendar className="h-4 w-4" />;
      case 'presentation':
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getTypeIcon(activeProject.type)}
              <div>
                <CardTitle>Editor de Projeto</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(activeProject.status)}
                  <span className="text-sm text-muted-foreground capitalize">
                    {activeProject.type}
                  </span>
                </div>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Nome do Projeto
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o nome do projeto"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">
              Descrição
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o projeto"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionEditor;
