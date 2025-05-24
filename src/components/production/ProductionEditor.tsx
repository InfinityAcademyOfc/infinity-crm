
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Save, 
  Share2, 
  Users, 
  MessageSquare,
  Settings,
  Download,
  Eye
} from 'lucide-react';
import { ProductionProject, useProductionWorkspace } from '@/hooks/useProductionWorkspace';
import AdvancedDocumentEditor from './editors/AdvancedDocumentEditor';
import AdvancedMindMapEditor from './editors/AdvancedMindMapEditor';
import AdvancedKanbanEditor from './editors/AdvancedKanbanEditor';
import AdvancedPresentationEditor from './editors/AdvancedPresentationEditor';
import ProductionChat from './collaboration/ProductionChat';
import ProductionCollaborators from './collaboration/ProductionCollaborators';
import { useWhatsApp } from '@/contexts/WhatsAppContext';
import { toast } from 'sonner';

interface ProductionEditorProps {
  project: ProductionProject;
  onClose: () => void;
}

export default function ProductionEditor({ project, onClose }: ProductionEditorProps) {
  const { updateProject, autoSave } = useProductionWorkspace();
  const { sendMessage, contacts, connectionStatus } = useWhatsApp();
  const [projectData, setProjectData] = useState(project.data || {});
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timer = setTimeout(() => {
        autoSave(project.id, projectData);
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        toast.success('Projeto salvo automaticamente');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [projectData, hasUnsavedChanges, project.id, autoSave]);

  const handleDataChange = (newData: any) => {
    setProjectData(newData);
    setHasUnsavedChanges(true);
  };

  const handleManualSave = () => {
    updateProject(project.id, { 
      data: projectData, 
      updated_at: new Date().toISOString() 
    });
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
    toast.success('Projeto salvo com sucesso!');
  };

  const handleShare = () => {
    if (connectionStatus === 'connected' && contacts.length > 0) {
      // Simulate sharing to WhatsApp
      const shareUrl = `${window.location.origin}/production/share/${project.id}`;
      const message = `🎯 Confira este projeto: "${project.name}"\n\n${shareUrl}\n\nTipo: ${project.type}\nStatus: ${project.status}`;
      
      // In a real implementation, you'd open a contact selector
      toast.success('Link de compartilhamento copiado!');
      navigator.clipboard.writeText(shareUrl);
    } else {
      const shareUrl = `${window.location.origin}/production/share/${project.id}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link de compartilhamento copiado!');
    }
  };

  const renderEditor = () => {
    switch (project.type) {
      case 'document':
        return (
          <AdvancedDocumentEditor
            data={projectData}
            onChange={handleDataChange}
            projectId={project.id}
          />
        );
      case 'mindmap':
        return (
          <AdvancedMindMapEditor
            data={projectData}
            onChange={handleDataChange}
            projectId={project.id}
          />
        );
      case 'kanban':
        return (
          <AdvancedKanbanEditor
            data={projectData}
            onChange={handleDataChange}
            projectId={project.id}
          />
        );
      case 'presentation':
        return (
          <AdvancedPresentationEditor
            data={projectData}
            onChange={handleDataChange}
            projectId={project.id}
          />
        );
      default:
        return <div>Tipo de projeto não suportado</div>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div>
            <h1 className="text-lg font-semibold">{project.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">{project.type}</Badge>
              <span>•</span>
              <span>Última alteração: {lastSaved.toLocaleString()}</span>
              {hasUnsavedChanges && (
                <>
                  <span>•</span>
                  <span className="text-amber-600">Alterações não salvas</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" />
            Compartilhar
          </Button>
          
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            Visualizar
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Exportar
          </Button>
          
          <Button size="sm" onClick={handleManualSave}>
            <Save className="h-4 w-4 mr-1" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Main content with tabs */}
      <div className="flex-1 flex">
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full justify-start border-b rounded-none h-12 p-0">
              <TabsTrigger value="editor" className="rounded-none">
                Editor
              </TabsTrigger>
              <TabsTrigger value="chat" className="rounded-none">
                <MessageSquare className="h-4 w-4 mr-1" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="collaborators" className="rounded-none">
                <Users className="h-4 w-4 mr-1" />
                Colaboradores
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-none">
                <Settings className="h-4 w-4 mr-1" />
                Configurações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 m-0 p-0">
              {renderEditor()}
            </TabsContent>

            <TabsContent value="chat" className="flex-1 m-0 p-0">
              <ProductionChat projectId={project.id} />
            </TabsContent>

            <TabsContent value="collaborators" className="flex-1 m-0 p-4">
              <ProductionCollaborators 
                project={project}
                onUpdateProject={(data) => updateProject(project.id, data)}
              />
            </TabsContent>

            <TabsContent value="settings" className="flex-1 m-0 p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Configurações do Projeto</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Status do Projeto</label>
                      <select
                        value={project.status}
                        onChange={(e) => updateProject(project.id, { status: e.target.value as any })}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="draft">Rascunho</option>
                        <option value="in_progress">Em Progresso</option>
                        <option value="review">Em Revisão</option>
                        <option value="completed">Concluído</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Descrição</label>
                      <textarea
                        value={project.description || ''}
                        onChange={(e) => updateProject(project.id, { description: e.target.value })}
                        className="w-full mt-1 p-2 border rounded-md"
                        rows={3}
                        placeholder="Descrição do projeto..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
