
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Mail, 
  Shield, 
  Eye, 
  Edit, 
  Trash2,
  Crown,
  Users
} from 'lucide-react';
import { ProductionProject } from '@/hooks/useProductionWorkspace';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProductionCollaboratorsProps {
  project: ProductionProject;
  onUpdateProject: (data: Partial<ProductionProject>) => void;
}

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  avatar?: string;
  last_active?: string;
  is_online?: boolean;
}

export default function ProductionCollaborators({ 
  project, 
  onUpdateProject 
}: ProductionCollaboratorsProps) {
  const { user } = useAuth();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [isInviting, setIsInviting] = useState(false);

  // Mock collaborators - in a real app, this would come from the API
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: user?.id || 'current-user',
      name: user?.user_metadata?.name || 'Você',
      email: user?.email || 'you@example.com',
      role: 'owner',
      is_online: true,
      last_active: new Date().toISOString()
    },
    {
      id: 'collab-1',
      name: 'Maria Silva',
      email: 'maria@example.com',
      role: 'editor',
      is_online: false,
      last_active: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'collab-2',
      name: 'João Santos',
      email: 'joao@example.com',
      role: 'viewer',
      is_online: true,
      last_active: new Date().toISOString()
    }
  ]);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCollaborator: Collaborator = {
        id: `collab-${Date.now()}`,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        is_online: false,
        last_active: new Date().toISOString()
      };
      
      setCollaborators(prev => [...prev, newCollaborator]);
      
      // Update project collaborators
      const updatedCollaborators = [...project.collaborators, newCollaborator.id];
      onUpdateProject({ collaborators: updatedCollaborators });
      
      setInviteEmail('');
      toast.success(`Convite enviado para ${inviteEmail}`);
    } catch (error) {
      toast.error('Erro ao enviar convite');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = (collaboratorId: string, newRole: 'editor' | 'viewer') => {
    setCollaborators(prev =>
      prev.map(collab =>
        collab.id === collaboratorId
          ? { ...collab, role: newRole }
          : collab
      )
    );
    toast.success('Permissão atualizada');
  };

  const handleRemoveCollaborator = (collaboratorId: string) => {
    setCollaborators(prev => prev.filter(collab => collab.id !== collaboratorId));
    
    const updatedCollaborators = project.collaborators.filter(id => id !== collaboratorId);
    onUpdateProject({ collaborators: updatedCollaborators });
    
    toast.success('Colaborador removido');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'editor':
        return <Edit className="h-4 w-4 text-blue-500" />;
      case 'viewer':
        return <Eye className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Proprietário';
      case 'editor':
        return 'Editor';
      case 'viewer':
        return 'Visualizador';
      default:
        return role;
    }
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Agora mesmo';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h atrás`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d atrás`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Colaboradores</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie quem pode acessar e editar este projeto
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {collaborators.length} colaborador{collaborators.length !== 1 ? 'es' : ''}
          </span>
        </div>
      </div>

      {/* Invite section */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Convidar Colaborador</h4>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Digite o e-mail..."
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
              className="px-3 py-2 border rounded-md"
            >
              <option value="editor">Editor</option>
              <option value="viewer">Visualizador</option>
            </select>
            <Button 
              onClick={handleInvite}
              disabled={!inviteEmail.trim() || isInviting}
            >
              {isInviting ? (
                <>Enviando...</>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Convidar
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Editores podem modificar o projeto. Visualizadores podem apenas ver.
          </p>
        </CardContent>
      </Card>

      {/* Collaborators list */}
      <div className="space-y-3">
        {collaborators.map((collaborator) => (
          <Card key={collaborator.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                      <AvatarFallback>
                        {collaborator.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {collaborator.is_online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{collaborator.name}</h4>
                      {collaborator.id === user?.id && (
                        <Badge variant="outline" className="text-xs">Você</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{collaborator.email}</span>
                      <span>•</span>
                      <span>
                        {collaborator.is_online ? 'Online' : formatLastActive(collaborator.last_active!)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {getRoleIcon(collaborator.role)}
                    <span className="text-sm">{getRoleLabel(collaborator.role)}</span>
                  </div>
                  
                  {collaborator.role !== 'owner' && (
                    <div className="flex gap-1">
                      <select
                        value={collaborator.role}
                        onChange={(e) => handleRoleChange(collaborator.id, e.target.value as 'editor' | 'viewer')}
                        className="text-sm px-2 py-1 border rounded"
                      >
                        <option value="editor">Editor</option>
                        <option value="viewer">Visualizador</option>
                      </select>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCollaborator(collaborator.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permissions info */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Níveis de Permissão</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">Proprietário:</span>
              <span className="text-muted-foreground">
                Controle total, pode gerenciar colaboradores e excluir o projeto
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Editor:</span>
              <span className="text-muted-foreground">
                Pode visualizar e editar o conteúdo do projeto
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Visualizador:</span>
              <span className="text-muted-foreground">
                Pode apenas visualizar o projeto, sem editar
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
