
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen, FileText, Brain, Calendar, Users } from 'lucide-react';
import { useProductionWorkspace } from '@/hooks/useProductionWorkspace';
import ProductionProjectDialog from './ProductionProjectDialog';
import AdvancedProjectEditor from './AdvancedProjectEditor';
import { useAuth } from '@/contexts/AuthContext';

const ProductionWorkspace = () => {
  const { 
    projects, 
    loadingProjects, 
    activeProject, 
    setActiveProject, 
    createProject 
  } = useProductionWorkspace();
  
  const { user } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'mindmap':
        return <Brain className="h-5 w-5" />;
      case 'kanban':
        return <Calendar className="h-5 w-5" />;
      case 'presentation':
        return <Users className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getProjectTypeLabel = (type: string) => {
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

  const handleCreateProject = async (projectData: {
    name: string;
    description: string;
    type: 'document' | 'mindmap' | 'kanban' | 'presentation';
  }) => {
    if (!user?.id) return;
    
    const newProject = await createProject({
      ...projectData,
      status: 'draft' as const,
      data: {},
      created_by: user.id
    });
    
    if (newProject) {
      setActiveProject(newProject);
      setShowCreateDialog(false);
    }
  };

  if (loadingProjects) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workspace de Produção</h1>
          <p className="text-muted-foreground">
            Crie e gerencie documentos, mapas mentais, kanbans e apresentações
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Projetos ({projects.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {projects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum projeto encontrado</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowCreateDialog(true)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Projeto
                  </Button>
                </div>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      activeProject?.id === project.id 
                        ? 'bg-primary/10 border-primary' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setActiveProject(project)}
                  >
                    <div className="flex items-center gap-3">
                      {getProjectIcon(project.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {getProjectTypeLabel(project.type)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Advanced Editor Area */}
        <div className="lg:col-span-2">
          <AdvancedProjectEditor />
        </div>
      </div>

      <ProductionProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleCreateProject}
      />
    </div>
  );
};

export default ProductionWorkspace;
