
import { useState } from "react";
import { TeamTableView } from "@/components/team/TeamTableView";
import { TeamGridView } from "@/components/team/TeamGridView";
import { useToast } from "@/hooks/use-toast";
import { mockTeamMembers } from "@/data/mockData";
import { Search, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
        
        <div className="flex gap-2 shrink-0">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            className="gap-1"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4" /> Tabela
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            className="gap-1"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" /> Cards
          </Button>
        </div>
      </div>
      
      {viewMode === "table" ? (
        <TeamTableView 
          members={filteredMembers}
          onDeleteMember={handleDeleteMember}
        />
      ) : (
        <TeamGridView 
          members={filteredMembers}
          onUpdateMember={handleUpdateMember}
        />
      )}
    </div>
  );
};

export default TeamManagement;
