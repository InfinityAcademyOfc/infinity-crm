
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
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (id: string) => void;
  onContactMember: (member: TeamMember) => void;
  onViewTasks: (member: TeamMember) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

const TeamTableView = ({
  members,
  onEditMember,
  onDeleteMember,
  onContactMember,
  onViewTasks,
  sortField,
  sortDirection,
  onSort
}: TeamTableViewProps) => {
  const getStatusBadge = (status: 'active' | 'inactive') => {
    return status === 'active' ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Ativo
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
        Inativo
      </Badge>
    );
  };

  const calculateProgress = (completed: number, assigned: number) => {
    if (assigned === 0) return 0;
    return Math.round((completed / assigned) * 100);
  };

  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField === field) {
      return (
        <ArrowUpDown 
          className={`h-4 w-4 ml-1 ${
            sortDirection === 'asc' ? 'rotate-180' : ''
          }`} 
        />
      );
    }
    return <ArrowUpDown className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-50" />;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 group"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center">
                Membro
                {getSortIcon('name')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 group"
              onClick={() => handleSort('role')}
            >
              <div className="flex items-center">
                Cargo
                {getSortIcon('role')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 group"
              onClick={() => handleSort('department')}
            >
              <div className="flex items-center">
                Departamento
                {getSortIcon('department')}
              </div>
            </TableHead>
            <TableHead>Contato</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 group"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center">
                Status
                {getSortIcon('status')}
              </div>
            </TableHead>
            <TableHead>Tarefas</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar_url} alt={member.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{member.role}</div>
              </TableCell>
              <TableCell>
                <div className="text-muted-foreground">
                  {member.department || 'Não definido'}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {member.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-3 w-3 mr-1" />
                      {member.phone}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-3 w-3 mr-1" />
                    {member.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(member.status)}
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{member.tasksCompleted}/{member.tasksAssigned}</span>
                    <span className="text-muted-foreground">
                      {calculateProgress(member.tasksCompleted, member.tasksAssigned)}%
                    </span>
                  </div>
                  <Progress 
                    value={calculateProgress(member.tasksCompleted, member.tasksAssigned)} 
                    className="h-2"
                  />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onEditMember(member)}
                      className="cursor-pointer"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onViewTasks(member)}
                      className="cursor-pointer"
                    >
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Ver Tarefas
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onContactMember(member)}
                      className="cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contatar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDeleteMember(member.id)}
                      className="text-destructive cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamTableView;
