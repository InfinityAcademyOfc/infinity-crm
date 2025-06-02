
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  MoreHorizontal, 
  Pencil, 
  CheckSquare, 
  MessageSquare, 
  Trash2,
  ArrowUpDown,
  Mail,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { TeamMember } from "@/types/team";
import { getInitials } from "@/lib/formatters";

interface TeamTableViewProps {
  members: TeamMember[];
  onDeleteMember: (id: string) => void;
}

export const TeamTableView = ({ members, onDeleteMember }: TeamTableViewProps) => {
  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">
              <Button variant="ghost" className="p-0 hover:bg-transparent">
                <span>Colaborador</span>
                <ArrowUpDown size={14} className="ml-2" />
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell">Cargo/Departamento</TableHead>
            <TableHead className="hidden md:table-cell">Contato</TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 hover:bg-transparent">
                <span>Produtividade</span>
                <ArrowUpDown size={14} className="ml-2" />
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                Nenhum colaborador encontrado
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar || undefined} alt={member.name} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="md:hidden text-xs text-muted-foreground">
                        {member.role}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div>{member.role}</div>
                  <div className="text-xs text-muted-foreground">{member.department}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-1 text-sm">
                    <Mail size={14} className="text-muted-foreground" />
                    <span>{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-1 text-sm mt-1">
                      <Phone size={14} className="text-muted-foreground" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Tarefas</span>
                      <span className="font-medium">{member.tasksCompleted}/{member.tasksAssigned}</span>
                    </div>
                    <Progress 
                      value={member.tasksAssigned > 0 ? (member.tasksCompleted / member.tasksAssigned) * 100 : 0} 
                      className="h-2"
                    />
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline" className={getStatusColor(member.status)}>
                    {member.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <MemberActions memberId={member.id} onDelete={onDeleteMember} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

interface MemberActionsProps {
  memberId: string;
  onDelete: (id: string) => void;
}

const MemberActions = ({ memberId, onDelete }: MemberActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <Pencil size={14} />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <CheckSquare size={14} />
          Ver Tarefas
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <MessageSquare size={14} />
          Enviar Feedback
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(memberId)}
          className="text-red-600 focus:text-red-600 gap-2 cursor-pointer"
        >
          <Trash2 size={14} />
          Remover
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
