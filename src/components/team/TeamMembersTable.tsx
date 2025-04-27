
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TeamMember } from "@/types/team";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TeamMembersTableProps {
  members: TeamMember[];
}

const TeamMembersTable = ({ members }: TeamMembersTableProps) => {
  // Status color mapping
  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    busy: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    away: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Nome</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead className="text-center">Tarefas</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>{member.name}</div>
                </div>
              </TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>{member.department}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.phone}</TableCell>
              <TableCell className="text-center">
                {member.tasksCompleted} / {member.tasksAssigned}
              </TableCell>
              <TableCell>
                <Badge className={statusColors[member.status] || "bg-gray-100 text-gray-800"}>
                  {member.status === "active" ? "Ativo" : 
                   member.status === "busy" ? "Ocupado" : 
                   member.status === "away" ? "Ausente" : member.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamMembersTable;
