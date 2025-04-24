
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SectionHeader } from '@/components/ui/section-header';
import TeamMemberCard from '@/components/settings/users/TeamMemberCard';
import InviteUserForm from '@/components/settings/users/InviteUserForm';
import PermissionsTab from '@/components/settings/users/PermissionsTab';
import InvitesTab from '@/components/settings/users/InvitesTab';

const UserSettings = () => {
  const { toast } = useToast();
  
  // Simulated list of team members
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'João Silva', email: 'joao@empresa.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Maria Santos', email: 'maria@empresa.com', role: 'editor', status: 'active' },
    { id: 3, name: 'Carlos Oliveira', email: 'carlos@empresa.com', role: 'viewer', status: 'pending' },
  ]);

  const handleInvite = (email: string, role: string) => {
    // In a real app, this would send an invitation
    const newMember = {
      id: teamMembers.length + 1,
      name: 'Convidado',
      email: email,
      role: role,
      status: 'pending'
    };
    
    setTeamMembers([...teamMembers, newMember]);
    
    toast({
      title: 'Convite enviado!',
      description: `Um convite foi enviado para ${email}.`
    });
  };

  const handleRemoveMember = (id: number) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
    
    toast({
      title: 'Usuário removido',
      description: 'O usuário foi removido da sua equipe.'
    });
  };

  const handleUpdateRole = (id: number, newRole: string) => {
    setTeamMembers(
      teamMembers.map(member => 
        member.id === id ? { ...member, role: newRole } : member
      )
    );
    
    toast({
      title: 'Função atualizada',
      description: 'As permissões do usuário foram atualizadas.'
    });
  };

  const pendingInvites = teamMembers.filter(member => member.status === 'pending');

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Configurações de Usuários" 
        description="Gerencie sua equipe e defina permissões de acesso"
      />
      
      <Tabs defaultValue="team">
        <TabsList className="mb-6">
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
          <TabsTrigger value="invites">Convites</TabsTrigger>
        </TabsList>
        
        {/* Team Members Tab */}
        <TabsContent value="team">
          <div className="grid gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {teamMembers.map(member => (
                      <TeamMemberCard 
                        key={member.id}
                        member={member}
                        onRoleChange={handleUpdateRole}
                        onRemove={handleRemoveMember}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <InviteUserForm onInvite={handleInvite} />
          </div>
        </TabsContent>
        
        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <PermissionsTab />
        </TabsContent>
        
        {/* Invites Tab */}
        <TabsContent value="invites">
          <InvitesTab 
            pendingInvites={pendingInvites}
            onRemoveInvite={handleRemoveMember}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSettings;
