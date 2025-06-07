
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List,
  FileText,
  Brain,
  Presentation,
  Kanban
} from 'lucide-react';
import { useProductionWorkspace, ProductionProject } from '@/hooks/useProductionWorkspace';
import ProductionEditor from './ProductionEditor';

const projectTypes = {
  document: { icon: FileText, label: 'Documento', color: 'blue' },
  mindmap: { icon: Brain, label: 'Mapa Mental', color: 'purple' },
  kanban: { icon: Kanban, label: 'Kanban', color: 'green' },
  presentation: { icon: Presentation, label: 'Apresentação', color: 'orange' }
};

const statusConfig = {
  draft: { label: 'Rascunho', color: 'secondary' },
  in_progress: { label: 'Em Progresso', color: 'default' },
  review: { label: 'Em Revisão', color: 'destructive' },
  completed: { label: 'Concluído', color: 'outline' }
};

export default function ProductionWorkspace() {
  const { 
    projects, 
    loadingProjects, 
    createProject, 
    isCreating,
    activeProject,
    setActiveProject 
  } = useProductionWorkspace();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = (type: keyof typeof projectTypes) => {
    const projectData = {
      name: `Novo ${projectTypes[type].label}`,
      description: `Projeto ${projectTypes[type].label} criado em ${new Date().toLocaleDateString('pt-BR')}`,
      type,
      status: 'draft' as const,
      data: {}
    };
    
    createProject(projectData);
    setShowCreateModal(false);
  };

  const handleOpenProject = (project: ProductionProject) => {
    setActiveProject(project);
  };

  if (activeProject) {
    return (
      <ProductionEditor 
        project={activeProject} 
        onClose={() => setActiveProject(null)} 
      />
    );
  }

  if (loadingProjects) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Gestão de Produção</h1>
            <p className="text-muted-foreground">
              Crie e gerencie documentos, mapas mentais, apresentações e kanbans
            </p>
          </div>
          
          <Button onClick={() => setShowCreateModal(true)} disabled={isCreating}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filtros
            </Button>
            
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            {projects.length === 0 ? (
              <div className="text-muted-foreground">
                <h3 className="text-lg font-medium mb-2">Nenhum projeto criado</h3>
                <p className="mb-4">Comece criando seu primeiro projeto</p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Projeto
                </Button>
              </div>
            ) : (
              <div className="text-muted-foreground">
                <h3 className="text-lg font-medium mb-2">Nenhum projeto encontrado</h3>
                <p>Tente usar outros termos de busca</p>
              </div>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredProjects.map((project) => {
              const typeConfig = projectTypes[project.type as keyof typeof projectTypes];
              const IconComponent = typeConfig.icon;
              
              return (
                <Card 
                  key={project.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleOpenProject(project)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-${typeConfig.color}-50`}>
                          <IconComponent className={`h-5 w-5 text-${typeConfig.color}-600`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {typeConfig.label}
                          </p>
                        </div>
                      </div>
                      
                      <Badge variant={statusConfig[project.status as keyof typeof statusConfig]?.color as any}>
                        {statusConfig[project.status as keyof typeof statusConfig]?.label}
                      </Badge>
                    </div>

                    {project.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>
                        Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      <span>
                        Atualizado {new Date(project.updated_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Criar Novo Projeto</h2>
              <p className="text-muted-foreground mb-6">
                Escolha o tipo de projeto que deseja criar
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(projectTypes).map(([type, config]) => {
                  const IconComponent = config.icon;
                  return (
                    <Button
                      key={type}
                      variant="outline"
                      className="h-24 flex-col gap-2"
                      onClick={() => handleCreateProject(type as keyof typeof projectTypes)}
                      disabled={isCreating}
                    >
                      <IconComponent className="h-8 w-8" />
                      <span>{config.label}</span>
                    </Button>
                  );
                })}
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
