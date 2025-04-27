
import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ZoomIn, ZoomOut, Move } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TeamMember } from "@/types/team";
import { DndProvider } from "@/components/ui/dnd-provider";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

interface DepartmentNode {
  id: string;
  name: string;
  members: TeamMember[];
  children: DepartmentNode[];
  expanded?: boolean;
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

const MemberNode = ({ member }: { member: TeamMember }) => {
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
    <div ref={setNodeRef} style={style} className="member-node" {...attributes} {...listeners}>
      <Avatar className="member-avatar">
        <AvatarImage src={member.avatar} alt={member.name} />
        <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="mt-2 text-xs font-medium text-center">
        <div className="truncate max-w-[120px]">{member.name}</div>
        <div className="text-muted-foreground text-[10px] truncate">{member.role}</div>
      </div>
    </div>
  );
};

const Department = ({ 
  department,
  level = 0,
  onToggleExpand,
  onEdit,
  onDelete,
  onAddMember,
  onAddDept,
}: {
  department: DepartmentNode;
  level?: number;
  onToggleExpand: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddMember: (id: string) => void;
  onAddDept: (id: string) => void;
}) => {
  return (
    <div className="tree-node">
      <div 
        className="department-node"
        onClick={() => onToggleExpand(department.id)}
      >
        <h3 className="department-title">{department.name}</h3>
        {department.expanded && (
          <div className="flex gap-1 mt-2 justify-center">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => {
              e.stopPropagation();
              onAddMember(department.id);
            }}>
              <Plus className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => {
              e.stopPropagation();
              onEdit(department.id);
            }}>
              <Move className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {department.expanded && (
        <>
          {department.members.length > 0 && (
            <div className="tree-connector-vertical h-8 top-full" />
          )}
          <div className="tree-level">
            {department.members.map((member, index) => (
              <MemberNode key={member.id} member={member} />
            ))}
          </div>
        </>
      )}

      {department.children.length > 0 && department.expanded && (
        <>
          <div className="tree-connector-vertical h-8" />
          <div className="tree-level">
            {department.children.map(child => (
              <Department
                key={child.id}
                department={child}
                level={level + 1}
                onToggleExpand={onToggleExpand}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddMember={onAddMember}
                onAddDept={onAddDept}
              />
            ))}
          </div>
        </>
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
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedDepts, setExpandedDepts] = useState<string[]>([departments[0]?.id || '']);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(Math.max(0.5, prev + delta), 2));
  };

  const toggleDepartmentExpand = (deptId: string) => {
    setExpandedDepts(prev => 
      prev.includes(deptId) 
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };

  const [deptState, setDeptState] = useState(departments.map(dept => ({
    ...dept,
    expanded: expandedDepts.includes(dept.id)
  })));

  useEffect(() => {
    setDeptState(departments.map(dept => ({
      ...dept,
      expanded: expandedDepts.includes(dept.id)
    })));
  }, [departments, expandedDepts]);

  return (
    <div className="relative h-[calc(100vh-200px)] overflow-hidden border rounded-lg">
      <div 
        ref={containerRef}
        className={`tree-container ${isDragging ? 'grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="tree-wrapper"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`
          }}
        >
          {deptState.map(department => (
            <Department
              key={department.id}
              department={department}
              onToggleExpand={toggleDepartmentExpand}
              onEdit={onEditDepartment}
              onDelete={onDeleteDepartment}
              onAddMember={onAddMember}
              onAddDept={onAddDepartment}
            />
          ))}
        </div>
      </div>

      <div className="zoom-controls">
        <Button variant="outline" size="icon" onClick={() => handleZoom(0.1)}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => handleZoom(-0.1)}>
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TeamOrgChart;
