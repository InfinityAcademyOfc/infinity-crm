
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TeamMember } from "@/types/team";
import { Badge } from "@/components/ui/badge";

interface DepartmentNode {
  id: string;
  name: string;
  members: TeamMember[];
  children: DepartmentNode[];
}

interface TeamOrgChartProps {
  departments: DepartmentNode[];
  onAddDepartment: (parentId: string | null) => void;
  onEditDepartment: (departmentId: string) => void;
  onDeleteDepartment: (departmentId: string) => void;
  onAddMember: (departmentId: string) => void;
  onEditMember: (memberId: string) => void;
  onDeleteMember: (memberId: string) => void;
}

const TeamOrgChart: React.FC<TeamOrgChartProps> = ({
  departments,
  onAddDepartment,
  onEditDepartment,
  onDeleteDepartment,
  onAddMember,
  onEditMember,
  onDeleteMember,
}) => {
  const { toast } = useToast();

  const renderMember = (member: TeamMember) => (
    <Card key={member.id} className="p-4 flex items-center justify-between gap-4 mb-2">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{member.name}</h4>
          <p className="text-sm text-muted-foreground">{member.role}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => onEditMember(member.id)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDeleteMember(member.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );

  const renderDepartment = (department: DepartmentNode) => (
    <div key={department.id} className="min-w-[300px]">
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{department.name}</h3>
            <Badge variant="secondary" className="mt-1">
              {department.members.length} membros
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => onAddMember(department.id)}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => onEditDepartment(department.id)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => onDeleteDepartment(department.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          {department.members.map(renderMember)}
        </div>
      </Card>

      {department.children.length > 0 && (
        <div className="ml-8 pl-8 border-l">
          {department.children.map(renderDepartment)}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 overflow-x-auto">
      <div className="mb-6 flex justify-end">
        <Button onClick={() => onAddDepartment(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Departamento
        </Button>
      </div>
      
      <div className="min-w-max">
        {departments.map(renderDepartment)}
      </div>
    </div>
  );
};

export default TeamOrgChart;
