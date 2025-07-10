import { useState } from "react";
import { TeamTableView } from "@/components/team/TeamTableView";
import { TeamGridView } from "@/components/team/TeamGridView";
import TeamOrgChart from "@/components/team/TeamOrgChart";
import { TeamHierarchyView } from "@/components/team/TeamHierarchyView";
import { useToast } from "@/hooks/use-toast";
import { mockTeamMembers } from "@/data/mockData";
import { Search, Grid, List, LayoutPanelTop, GitBranch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamMember } from "@/types/team";

const mockDepartments = [
  {
    id: "1",
    name: "Diretoria Executiva",
    members: mockTeamMembers.filter(m => m.role.includes("Director") || m.role.includes("CEO")),
    children: [
      {
        id: "2",
        name: "Vendas",
        members: mockTeamMembers.filter(m => m.department === "Sales" && !m.role.includes("Director")),
        children: [
          {
            id: "5",
            name: "Vendas Corporativas",
            members: mockTeamMembers.filter(m => m.department === "Sales" && m.role.includes("Corporate")),
            children: []
          },
          {
            id: "6",
            name: "Vendas Varejo",
            members: mockTeamMembers.filter(m => m.department === "Sales" && m.role.includes("Retail")),
            children: []
          }
        ]
      },
      {
        id: "3",
        name: "Marketing",
        members: mockTeamMembers.filter(m => m.department === "Marketing" && !m.role.includes("Director")),
        children: [
          {
            id: "7",
            name: "Marketing Digital",
            members: mockTeamMembers.filter(m => m.department === "Marketing" && m.role.includes("Digital")),
            children: []
          }
        ]
      },
      {
        id: "4",
        name: "Tecnologia",
        members: mockTeamMembers.filter(m => m.department === "Tech" || m.department === "IT"),
        children: [
          {
            id: "8",
            name: "Desenvolvimento",
            members: mockTeamMembers.filter(m => m.department === "Tech" && m.role.includes("Developer")),
            children: []
          },
          {
            id: "9",
            name: "Infraestrutura",
            members: mockTeamMembers.filter(m => m.department === "IT" && m.role.includes("Infrastructure")),
            children: []
          }
        ]
      }
    ]
  }
];

const TeamManagement = () => {
  const [members, setMembers] = useState(mockTeamMembers);
  const [departments, setDepartments] = useState(mockDepartments);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const handleDeleteMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
    
    const removeMemberFromDepts = (depts: any[]) => {
      return depts.map(dept => ({
        ...dept,
        members: dept.members.filter((m: any) => m.id !== id),
        children: removeMemberFromDepts(dept.children)
      }));
    };
    
    setDepartments(removeMemberFromDepts(departments));
    
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
    const newDeptId = `dept-${Date.now()}`;
    
    if (!parentId) {
      const newDepartment = {
        id: newDeptId,
        name: "Novo Departamento",
        members: [],
        children: []
      };
      
      setDepartments([...departments, newDepartment]);
    } else {
      const addChildDept = (depts: any[], pId: string) => {
        return depts.map(dept => {
          if (dept.id === pId) {
            return {
              ...dept,
              children: [
                ...dept.children,
                {
                  id: newDeptId,
                  name: "Novo Sub-departamento",
                  members: [],
                  children: []
                }
              ]
            };
          }
          
          return {
            ...dept,
            children: addChildDept(dept.children, pId)
          };
        });
      };
      
      setDepartments(addChildDept(departments, parentId));
    }
    
    toast({
      title: "Departamento adicionado",
      description: "Um novo departamento foi criado."
    });
  };

  const handleEditDepartment = (departmentId: string) => {
    toast({
      title: "Editar departamento",
      description: `Editando departamento ID: ${departmentId}`
    });
  };

  const handleDeleteDepartment = (departmentId: string) => {
    const deleteDept = (depts: any[]) => {
      return depts.filter(dept => {
        if (dept.id === departmentId) return false;
        return true;
      }).map(dept => ({
        ...dept,
        children: deleteDept(dept.children)
      }));
    };
    
    setDepartments(deleteDept(departments));
    
    toast({
      title: "Departamento removido",
      description: "O departamento foi removido com sucesso."
    });
  };

  const handleMoveMember = (memberId: string, toDepartmentId: string) => {
    toast({
      title: "Membro movido",
      description: `Movido membro ${memberId} para departamento ${toDepartmentId}`
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

      <Tabs defaultValue="hierarchy">
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
          <TabsTrigger value="hierarchy">
            <GitBranch className="h-4 w-4 mr-2" />
            Hierarquia
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

        <TabsContent value="org" className="mt-4">
          <TeamOrgChart
            departments={departments}
            onAddDepartment={handleAddDepartment}
            onEditDepartment={handleEditDepartment}
            onDeleteDepartment={handleDeleteDepartment}
            onAddMember={handleUpdateMember}
            onEditMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
          />
        </TabsContent>

        <TabsContent value="hierarchy" className="mt-4">
          <TeamHierarchyView companyId="mock-company-id" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagement;
