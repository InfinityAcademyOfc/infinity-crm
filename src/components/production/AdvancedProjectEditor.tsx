
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  FileText, 
  Brain, 
  Calendar, 
  Users, 
  Settings, 
  Share2, 
  Download,
  Eye,
  Edit,
  Clock,
  User
} from 'lucide-react';
import { useProductionWorkspace } from '@/hooks/useProductionWorkspace';
import { toast } from 'sonner';
import DocumentEditor from './editors/DocumentEditor';
import MindMapEditor from './editors/MindMapEditor';
import KanbanEditor from './editors/KanbanEditor';
import PresentationEditor from './editors/PresentationEditor';

const AdvancedProjectEditor = () => {
  const { 
    activeProject, 
    updateProject 
  } = useProductionWorkspace();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (activeProject) {
      setTitle(activeProject.name);
      setDescription(activeProject.description || '');
      setLastSaved(new Date(activeProject.updated_at));
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
      setLastSaved(new Date());
      toast.success('Projeto salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      toast.error('Erro ao salvar projeto');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoSave = async () => {
    if (!activeProject) return;
    
    try {
      await updateProject(activeProject.id, {
        name: title,
        description
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Erro no auto-save:', error);
    }
  };

  // Auto-save a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(handleAutoSave, 30000);
    return () => clearInterval(interval);
  }, [title, description, activeProject]);

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
        return <Brain className="h-4 w-4" />;
      case 'kanban':
        return <Calendar className="h-4 w-4" />;
      case 'presentation':
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'document':
        return 'Documento';
      case 'mindmap':
        return 'Mapa Mental';
      case 'kanban':
        return 'Kanban';
      case 'presentation':
        return 'Apresentação';
      default:
        return type;
    }
  };

  const renderEditor = () => {
    if (!activeProject) return null;

    switch (activeProject.type) {
      case 'document':
        return <DocumentEditor project={activeProject} onUpdate={updateProject} />;
      case 'mindmap':
        return <MindMapEditor project={activeProject} onUpdate={updateProject} />;
      case 'kanban':
        return <KanbanEditor project={activeProject} onUpdate={updateProject} />;
      case 'presentation':
        return <PresentationEditor project={activeProject} onUpdate={updateProject} />;
      default:
        return <div className="text-center py-8 text-muted-foreground">Tipo de projeto não suportado</div>;
    }
  };

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Selecione um projeto para editar</p>
          <p className="text-sm text-muted-foreground mt-2">
            Escolha um projeto da lista ao lado ou crie um novo projeto
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getTypeIcon(activeProject.type)}
              <div>
                <CardTitle>Editor Avançado - {getTypeLabel(activeProject.type)}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(activeProject.status)}
                  {lastSaved && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Salvo às {lastSaved.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {previewMode ? 'Editar' : 'Visualizar'}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="collaboration">Colaboração</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Projeto</CardTitle>
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
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Editor específico do tipo de projeto */}
          <Card>
            <CardHeader>
              <CardTitle>Editor de {getTypeLabel(activeProject.type)}</CardTitle>
            </CardHeader>
            <CardContent>
              {renderEditor()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Status do Projeto</label>
                  <div className="mt-2">
                    {getStatusBadge(activeProject.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo de Projeto</label>
                  <div className="mt-2 flex items-center gap-2">
                    {getTypeIcon(activeProject.type)}
                    <span>{getTypeLabel(activeProject.type)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Criado em</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(activeProject.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Última atualização</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(activeProject.updated_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Colaboradores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Sistema de colaboração em desenvolvimento</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Em breve você poderá convidar outros usuários para colaborar neste projeto.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedProjectEditor;
