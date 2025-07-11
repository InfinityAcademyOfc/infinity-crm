
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { TeamMember } from "@/types/team";
import { mockTeamMembers } from "@/data/mockData";

export interface Department {
  id: string;
  name: string;
  members: TeamMember[];
  children: Department[];
}

export const useTeamManagement = () => {
  const { company } = useAuth();
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamData();
  }, [company]);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMembers(mockTeamMembers);
      setDepartments(generateMockDepartments());
    } catch (error) {
      console.error('Erro ao carregar dados da equipe:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados da equipe",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockDepartments = (): Department[] => {
    return [
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
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
    
    const removeMemberFromDepts = (depts: Department[]): Department[] => {
      return depts.map(dept => ({
        ...dept,
        members: dept.members.filter(m => m.id !== id),
        children: removeMemberFromDepts(dept.children)
      }));
    };
    
    setDepartments(removeMemberFromDepts(departments));
    
    toast({
      title: "Usuário removido",
      description: "O usuário foi removido da sua equipe."
    });
  };

  const handleUpdateMember = (updatedMember: TeamMember) => {
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
      const newDepartment: Department = {
        id: newDeptId,
        name: "Novo Departamento",
        members: [],
        children: []
      };
      
      setDepartments([...departments, newDepartment]);
    } else {
      const addChildDept = (depts: Department[], pId: string): Department[] => {
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
    const deleteDept = (depts: Department[]): Department[] => {
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

  const filterMembers = (searchQuery: string) => {
    return members.filter(member => 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.department && member.department.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  return {
    members,
    departments,
    loading,
    handleDeleteMember,
    handleUpdateMember,
    handleAddDepartment,
    handleEditDepartment,
    handleDeleteDepartment,
    handleMoveMember,
    filterMembers
  };
};
