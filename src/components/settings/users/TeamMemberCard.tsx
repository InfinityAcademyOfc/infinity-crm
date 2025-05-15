
import React from "react";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
  onRoleChange: (id: number, role: string) => void;
  onRemove: (id: number) => void;
}

const TeamMemberCard = ({ member, onRoleChange, onRemove }: TeamMemberCardProps) => {
  return (
    <Card key={member.id} className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="font-medium">{member.name}</span>
            <span className="text-sm text-muted-foreground">{member.email}</span>
            <div className="mt-2 flex items-center">
              <span className="text-xs font-medium mr-2">Função:</span>
              <Select 
                defaultValue={member.role}
                onValueChange={(value) => onRoleChange(member.id, value)}
              >
                <SelectTrigger className="h-7 w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {member.status === 'pending' ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Pendente
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Ativo
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-8 px-2"
              onClick={() => onRemove(member.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMemberCard;
