
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  FileText, 
  Brain, 
  Kanban, 
  Presentation,
  Folder,
  Users,
  Clock,
  Filter
} from 'lucide-react';
import { useProductionWorkspace } from '@/hooks/useProductionWorkspace';
import ProductionProjectDialog from './ProductionProjectDialog';
import ProductionEditor from './ProductionEditor';
import { cn } from '@/lib/utils';

const projectTypeIcons = {
  document: FileText,
  mindmap: Brain,
  kanban: Kanban,
  presentation: Presentation
};

const statusColors = {
  draft: 'bg-gray-500',
  in_progress: 'bg-blue-500',
  review: 'bg-yellow-500',
  completed: 'bg-green-500'
};

export default function ProductionWorkspace() {
  const {
    projects,
    folders,
    activeProject,
    setActiveProject,
    selectedFolder,
    setSelectedFolder,
    loadingProjects,
    createProject,
    createFolder
  } = useProductionWorkspace();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || project.type === filterType;
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesFolder = !selectedFolder || project.folder_id === selectedFolder;
    
    return matchesSearch && matchesType && matchesStatus && matchesFolder;
  });

  if (activeProject) {
    return (
      <ProductionEditor 
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Sistema de Produção</h1>
            <p className="text-muted-foreground">
              Crie e gerencie documentos, mind maps, apresentações e projetos kanban
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Todos os tipos</option>
              <option value="document">Documentos</option>
              <option value="mindmap">Mind Maps</option>
              <option value="kanban">Kanban</option>
              <option value="presentation">Apresentações</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Todos os status</option>
              <option value="draft">Rascunho</option>
              <option value="in_progress">Em Progresso</option>
              <option value="review">Em Revisão</option>
              <option value="completed">Concluído</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with folders */}
        <div className="w-64 border-r p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Pastas</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => createFolder({ name: `Nova Pasta ${folders.length + 1}` })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-1">
            <Button
              variant={!selectedFolder ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedFolder(null)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Todos os projetos
            </Button>
            
            {folders.map((folder) => (
              <Button
                key={folder.id}
                variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedFolder(folder.id)}
              >
                <Folder className="h-4 w-4 mr-2" />
                {folder.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          {loadingProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded w-3/4 mb-4" />
                    <div className="flex justify-between">
                      <div className="h-3 bg-muted rounded w-16" />
                      <div className="h-3 bg-muted rounded w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum projeto encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Tente alterar os filtros ou criar um novo projeto' : 'Comece criando seu primeiro projeto'}
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Projeto
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => {
                const IconComponent = projectTypeIcons[project.type];
                return (
                  <Card 
                    key={project.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setActiveProject(project)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-5 w-5 text-primary" />
                          <Badge variant="outline" className="text-xs">
                            {project.type}
                          </Badge>
                        </div>
                        <div className={cn("w-2 h-2 rounded-full", statusColors[project.status])} />
                      </div>
                      
                      <h3 className="font-medium mb-1 line-clamp-1">{project.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {project.description || 'Sem descrição'}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {project.collaborators.length}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(project.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ProductionProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateProject={createProject}
        folders={folders}
      />
    </div>
  );
}
