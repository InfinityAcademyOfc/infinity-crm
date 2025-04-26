
import { useState } from "react";
import { TeamTableView } from "@/components/team/TeamTableView";
import { TeamGridView } from "@/components/team/TeamGridView";
import TeamOrgChart from "@/components/team/TeamOrgChart";
import { useToast } from "@/hooks/use-toast";
import { mockTeamMembers } from "@/data/mockData";
import { Search, Grid, List, LayoutPanelTop } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamMember } from "@/types/team";

const mockDepartments = [
  {
    id: "1",
    name: "Direção",
    members: mockTeamMembers.filter(m => m.role === "Director"),
    children: [
      {
        id: "2",
        name: "Vendas",
        members: mockTeamMembers.filter(m => m.department === "Sales"),
        children: []
      },
      {
        id: "3",
        name: "Marketing",
        members: mockTeamMembers.filter(m => m.department === "Marketing"),
        children: []
      }
    ]
  }
];

const TeamManagement = () => {
  const [members, setMembers] = useState(mockTeamMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const { toast } = useToast();
  
  const handleDeleteMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
    
    toast({
      title: "Usuário removido",
      description: "O usuário foi removido da sua equipe."
    });
  };

  const handleUpdateMember = (updatedMember: any) => {
    setMembers(
      members.map(member => 
        member.id === updatedMember.id ? { ...member, ...updatedMember } : member
      )
    );
    
    toast({
      title: "Usuário atualizado",
      description: "As informações do usuário foram atualizadas."
    });
  };

  const handleAddDepartment = (parentId: string | null) => {
    toast({
      title: "Adicionar departamento",
      description: "Funcionalidade em desenvolvimento"
    });
  };

  const handleEditDepartment = (departmentId: string) => {
    toast({
      title: "Editar departamento",
      description: "Funcionalidade em desenvolvimento"
    });
  };

  const handleDeleteDepartment = (departmentId: string) => {
    toast({
      title: "Remover departamento",
      description: "Funcionalidade em desenvolvimento"
    });
  };

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.department && member.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
      </div>

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
          <TabsTrigger value="org">
            <LayoutPanelTop className="h-4 w-4 mr-2" />
            Organograma
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

        <TabsContent value="org">
          <TeamOrgChart
            departments={mockDepartments}
            onAddDepartment={handleAddDepartment}
            onEditDepartment={handleEditDepartment}
            onDeleteDepartment={handleDeleteDepartment}
            onAddMember={handleUpdateMember}
            onEditMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagement;
