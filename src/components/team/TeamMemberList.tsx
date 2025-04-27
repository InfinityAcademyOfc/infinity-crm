
import { Card, CardContent } from "@/components/ui/card";
import { TeamMember } from "@/types/team";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TeamMemberListProps {
  members: TeamMember[];
}

const TeamMemberList = ({ members }: TeamMemberListProps) => {
  // Status color mapping
  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    busy: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    away: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <Card key={member.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-base">{member.name}</h3>
                  <Badge className={statusColors[member.status] || "bg-gray-100 text-gray-800"}>
                    {member.status === "active" ? "Ativo" : 
                     member.status === "busy" ? "Ocupado" : 
                     member.status === "away" ? "Ausente" : member.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.department}</p>
                <div className="flex items-center justify-between text-xs pt-2">
                  <span>{member.email}</span>
                  <span className="text-muted-foreground">{member.phone}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span>Tarefas: {member.tasksCompleted} / {member.tasksAssigned}</span>
                  <span className="text-muted-foreground">
                    {member.joinedDate && `Desde ${new Date(member.joinedDate).toLocaleDateString('pt-BR')}`}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeamMemberList;
