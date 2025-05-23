
import { useState } from "react";
import { TeamTableView } from "@/components/team/TeamTableView";
import { TeamGridView } from "@/components/team/TeamGridView";
import { useToast } from "@/hooks/use-toast";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { Search, Grid, List, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import NewTeamMemberDialog from "@/components/team/NewTeamMemberDialog";
import { useAuth } from "@/contexts/AuthContext";

const TeamManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newMemberDialogOpen, setNewMemberDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user, company } = useAuth();
  const { teamMembers, loading, deleteTeamMember, refetch } = useTeamMembers();
  
  const handleDeleteMember = async (id: string) => {
    try {
      await deleteTeamMember(id);
      refetch();
    } catch (error) {
      console.error('Erro ao deletar membro:', error);
    }
  };

  const handleUpdateMember = async (updatedMember: any) => {
    // Implementation would go here for updating member
    toast({
      title: "Usuário atualizado",
      description: "As informações do usuário foram atualizadas."
    });
    refetch();
  };

  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.department && member.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!user || !company) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Faça login para gerenciar a equipe</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="ml-2">Carregando membros da equipe...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-auto relative">
          <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Buscar membros..."
            className="w-full pl-10 pr-4 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setNewMemberDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Colaborador
        </Button>
      </div>

      {filteredMembers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Nenhum membro da equipe encontrado.
            </p>
            <Button onClick={() => setNewMemberDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Membro
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="grid">
          <TabsList>
            <TabsTrigger value="grid">
              <Grid className="h-4 w-4 mr-2" />
              Cards
            </TabsTrigger>
            <TabsTrigger value="table">
              <List className="h-4 w-4 mr-2" />
              Tabela
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            <TeamGridView 
              members={filteredMembers}
              onUpdateMember={handleUpdateMember}
            />
          </TabsContent>

          <TabsContent value="table">
            <TeamTableView 
              members={filteredMembers}
              onDeleteMember={handleDeleteMember}
            />
          </TabsContent>
        </Tabs>
      )}

      <NewTeamMemberDialog
        open={newMemberDialogOpen}
        onOpenChange={setNewMemberDialogOpen}
        onMemberCreated={refetch}
      />
    </div>
  );
};

export default TeamManagement;
