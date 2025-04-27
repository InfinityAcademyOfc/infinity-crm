
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import TeamMemberList from "@/components/team/TeamMemberList";
import TeamMembersTable from "@/components/team/TeamMembersTable";
import OrgChart from "@/components/team/OrgChart";
import NewTeamMemberDialog from "@/components/team/NewTeamMemberDialog";
import { TeamMember, DepartmentNode } from "@/types/team";

const TeamManagement = () => {
  const [activeTab, setActiveTab] = useState("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewMemberDialogOpen, setIsNewMemberDialogOpen] = useState(false);

  // Mock team members data
  const mockTeamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Carlos Silva",
      email: "carlos.silva@empresa.com",
      role: "CEO",
      department: "Diretoria",
      avatar: "/avatar-placeholder.jpg",
      status: "active",
      joinedDate: "2020-01-15",
      phone: "(11) 98765-4321",
      tasksAssigned: 12,
      tasksCompleted: 10
    },
    {
      id: "2",
      name: "Ana Oliveira",
      email: "ana.oliveira@empresa.com",
      role: "Gerente de Vendas",
      department: "Vendas",
      avatar: "/avatar-placeholder.jpg",
      status: "active",
      joinedDate: "2020-03-22",
      phone: "(11) 98765-4322",
      tasksAssigned: 18,
      tasksCompleted: 15
    },
    {
      id: "3",
      name: "Pedro Santos",
      email: "pedro.santos@empresa.com",
      role: "Desenvolvedor",
      department: "TI",
      avatar: "/avatar-placeholder.jpg",
      status: "busy",
      joinedDate: "2021-05-10",
      phone: "(11) 98765-4323",
      tasksAssigned: 8,
      tasksCompleted: 5
    },
    {
      id: "4",
      name: "Mariana Costa",
      email: "mariana.costa@empresa.com",
      role: "Designer",
      department: "Marketing",
      avatar: "/avatar-placeholder.jpg",
      status: "away",
      joinedDate: "2021-06-15",
      phone: "(11) 98765-4324",
      tasksAssigned: 14,
      tasksCompleted: 12
    },
    {
      id: "5",
      name: "Lucas Mendes",
      email: "lucas.mendes@empresa.com",
      role: "Analista Financeiro",
      department: "Financeiro",
      avatar: "/avatar-placeholder.jpg",
      status: "active",
      joinedDate: "2022-01-10",
      phone: "(11) 98765-4325",
      tasksAssigned: 10,
      tasksCompleted: 8
    }
  ];

  // Mock org chart data
  const mockOrgChartData: DepartmentNode[] = [
    {
      id: "dept-1",
      name: "Diretoria",
      members: [mockTeamMembers[0]],
      children: [
        {
          id: "dept-2",
          name: "Vendas",
          members: [mockTeamMembers[1]],
          children: []
        },
        {
          id: "dept-3",
          name: "TI",
          members: [mockTeamMembers[2]],
          children: []
        },
        {
          id: "dept-4",
          name: "Marketing",
          members: [mockTeamMembers[3]],
          children: []
        },
        {
          id: "dept-5",
          name: "Financeiro",
          members: [mockTeamMembers[4]],
          children: []
        }
      ]
    }
  ];

  // Filter members based on search query
  const filteredMembers = mockTeamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="table">Tabela</TabsTrigger>
            <TabsTrigger value="orgchart">Organograma</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 ml-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar membros..."
              className="pl-8 w-[200px] h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button size="sm" className="h-9" onClick={() => setIsNewMemberDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            <span>Novo Membro</span>
          </Button>
        </div>
      </div>

      <TabsContent value="cards" className="m-0">
        <TeamMemberList members={filteredMembers} />
      </TabsContent>

      <TabsContent value="table" className="m-0">
        <TeamMembersTable members={filteredMembers} />
      </TabsContent>

      <TabsContent value="orgchart" className="m-0">
        <OrgChart data={mockOrgChartData} />
      </TabsContent>

      <NewTeamMemberDialog
        open={isNewMemberDialogOpen}
        onOpenChange={setIsNewMemberDialogOpen}
      />
    </div>
  );
};

export default TeamManagement;
