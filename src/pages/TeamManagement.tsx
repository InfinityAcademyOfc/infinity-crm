
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import TeamTableView from '@/components/team/TeamTableView';
import { Plus } from 'lucide-react';

const TeamManagement = () => {
  const { teamMembers, loading } = useTeamMembers();

  const handleEditMember = (member: any) => {
    console.log('Edit member:', member);
  };

  const handleDeleteMember = (id: string) => {
    console.log('Delete member:', id);
  };

  const handleContactMember = (member: any) => {
    console.log('Contact member:', member);
  };

  const handleViewTasks = (member: any) => {
    console.log('View tasks:', member);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Equipe</h1>
          <p className="text-muted-foreground">
            Gerencie sua equipe e acompanhe performance
          </p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Membro
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membros da Equipe ({teamMembers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nenhum membro da equipe encontrado
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Comece adicionando membros à sua equipe
              </p>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                Adicionar Primeiro Membro
              </button>
            </div>
          ) : (
            <TeamTableView
              members={teamMembers}
              onEditMember={handleEditMember}
              onDeleteMember={handleDeleteMember}
              onContactMember={handleContactMember}
              onViewTasks={handleViewTasks}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;
