
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, MoveVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TeamMember } from "@/types/team";
import { Badge } from "@/components/ui/badge";
import { DndProvider } from "@/components/ui/dnd-provider";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

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
  onMoveMember?: (memberId: string, toDepartmentId: string) => void;
  onMoveDepartment?: (departmentId: string, toParentId: string | null) => void;
}

const SortableMember = ({ member, onEdit, onDelete }: { 
  member: TeamMember; 
  onEdit: (id: string) => void; 
  onDelete: (id: string) => void; 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: member.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} key={member.id} className="p-3 flex items-center justify-between gap-2 mb-2 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium text-sm">{member.name}</h4>
          <p className="text-xs text-muted-foreground">{member.role}</p>
        </div>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" {...attributes} {...listeners}>
          <MoveVertical className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(member.id)}>
          <Pencil className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(member.id)}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
};

const Department = ({ 
  department, 
  level = 0, 
  onEdit, 
  onDelete, 
  onAddMember, 
  onAddDept, 
  onEditMember,
  onDeleteMember
}: { 
  department: DepartmentNode; 
  level?: number; 
  onEdit: (id: string) => void; 
  onDelete: (id: string) => void; 
  onAddMember: (id: string) => void; 
  onAddDept: (id: string) => void; 
  onEditMember: (id: string) => void;
  onDeleteMember: (id: string) => void;
}) => {
  const memberIds = department.members.map(m => m.id);

  const handleDragEnd = (activeId: string, overId: string) => {
    // This would be implemented to handle member reordering within a department
    console.log(`Moving ${activeId} over ${overId}`);
  };

  return (
    <div className={`relative ${level === 0 ? 'w-full mb-6' : 'w-full'}`}>
      <Card className={`p-4 ${level === 0 ? 'border-primary/50 shadow-md' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className={`${level === 0 ? 'text-xl' : 'text-lg'} font-semibold`}>
              {department.name}
            </h3>
            <Badge variant="secondary" className="mt-1">
              {department.members.length} {department.members.length === 1 ? 'membro' : 'membros'}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onAddMember(department.id)}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onAddDept(department.id)}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(department.id)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onDelete(department.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <DndProvider items={memberIds} onDragEnd={handleDragEnd}>
            {department.members.map(member => (
              <SortableMember 
                key={member.id} 
                member={member} 
                onEdit={onEditMember} 
                onDelete={onDeleteMember} 
              />
            ))}
          </DndProvider>
        </div>
      </Card>

      {department.children.length > 0 && (
        <div className="mt-4 relative">
          {/* Vertical line from parent to children */}
          <div className="absolute left-1/2 -top-4 w-px h-4 bg-border -translate-x-1/2"></div>
          
          {/* Horizontal line connecting all children */}
          {department.children.length > 1 && (
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-border"></div>
          )}
          
          <div className={`grid grid-cols-1 ${
            department.children.length > 1 
              ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : ''
          } gap-4`}>
            {department.children.map(child => (
              <div key={child.id} className="relative">
                {/* Vertical line from horizontal connector to child */}
                <div className="absolute left-1/2 -top-4 w-px h-4 bg-border -translate-x-1/2"></div>
                
                <Department 
                  department={child} 
                  level={level + 1} 
                  onEdit={onEdit} 
                  onDelete={onDelete}
                  onAddMember={onAddMember}
                  onAddDept={onAddDept}
                  onEditMember={onEditMember}
                  onDeleteMember={onDeleteMember}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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
  const [expandedDepts, setExpandedDepts] = useState<string[]>([]);

  const toggleDeptExpand = (deptId: string) => {
    setExpandedDepts(prev => 
      prev.includes(deptId) 
        ? prev.filter(id => id !== deptId) 
        : [...prev, deptId]
    );
  };

  return (
    <div className="p-4 overflow-x-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Organograma da Empresa</h2>
        <Button onClick={() => onAddDepartment(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Departamento
        </Button>
      </div>
      
      <div className="min-w-max tree-container pb-10">
        {departments.map(dept => (
          <Department 
            key={dept.id} 
            department={dept} 
            onEdit={onEditDepartment} 
            onDelete={onDeleteDepartment}
            onAddMember={onAddMember}
            onAddDept={onAddDepartment}
            onEditMember={onEditMember}
            onDeleteMember={onDeleteMember}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamOrgChart;
