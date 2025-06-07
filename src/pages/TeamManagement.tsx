
import { useState } from "react";
import { TeamTableView } from "@/components/team/TeamTableView";
import { TeamGridView } from "@/components/team/TeamGridView";
import { useToast } from "@/hooks/use-toast";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { Search, Grid, List, Plus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import NewTeamMemberDialog from "@/components/team/NewTeamMemberDialog";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { SectionHeader } from "@/components/ui/section-header";

const TeamManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newMemberDialogOpen, setNewMemberDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user, company, loading: authLoading } = useAuth();
  const { teamMembers, loading, deleteTeamMember, refetch } = useTeamMembers();

  if (authLoading) {
    return <LoadingPage message="Verificando autenticação..." />;
  }

  if (!user || !company) {
    return <LoadingPage message="Acesso não autorizado" />;
  }
  
  const handleDeleteMember = async (id: string) => {
    try {
      await deleteTeamMember(id);
      refetch();
      toast({
        title: "Membro removido",
        description: "O membro foi removido da equipe com sucesso."
      });
    } catch (error) {
      console.error('Erro ao deletar membro:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o membro da equipe.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateMember = async (updatedMember: any) => {
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

  if (loading) {
    return <LoadingPage message="Carregando membros da equipe..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader 
        title="Gestão de Equipe" 
        description="Gerencie os membros da sua equipe e suas permissões"
        actions={
          <>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar membros..."
                className="pl-10 focus-ring"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => setNewMemberDialogOpen(true)}
              className="hover-scale transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Colaborador
            </Button>
          </>
        }
      />

      {filteredMembers.length === 0 ? (
        <Card className="animate-scale-in">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {searchQuery ? 'Nenhum membro encontrado' : 'Nenhum membro da equipe'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Tente ajustar os filtros de busca' 
                : 'Comece adicionando membros à sua equipe'
              }
            </p>
            {!searchQuery && (
              <Button 
                onClick={() => setNewMemberDialogOpen(true)}
                className="hover-scale transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Membro
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="grid" className="animate-fade-in">
          <TabsList>
            <TabsTrigger value="grid" className="transition-all duration-200">
              <Grid className="h-4 w-4 mr-2" />
              Cards
            </TabsTrigger>
            <TabsTrigger value="table" className="transition-all duration-200">
              <List className="h-4 w-4 mr-2" />
              Tabela
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="animate-fade-in">
            <TeamGridView 
              members={filteredMembers}
              onUpdateMember={handleUpdateMember}
            />
          </TabsContent>

          <TabsContent value="table" className="animate-fade-in">
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
