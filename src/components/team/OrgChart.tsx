
import { useState } from "react";
import { DepartmentNode, TeamMember } from "@/types/team";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrgChartProps {
  data: DepartmentNode[];
}

const OrgChart = ({ data }: OrgChartProps) => {
  const [expandedDepartments, setExpandedDepartments] = useState<Record<string, boolean>>(
    data.reduce((acc: Record<string, boolean>, node) => {
      acc[node.id] = true; // Start with root expanded
      return acc;
    }, {})
  );

  const toggleDepartment = (id: string) => {
    setExpandedDepartments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderMemberCards = (members: TeamMember[]) => {
    return (
      <div className="grid grid-cols-1 gap-3 mt-3">
        {members.map((member) => (
          <Card key={member.id} className="bg-background shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-xs text-muted-foreground">{member.role}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderDepartment = (node: DepartmentNode, depth: number = 0) => {
    const isExpanded = expandedDepartments[node.id] || false;
    
    return (
      <div
        key={node.id}
        className="border-l-2 pl-4 ml-2 mt-2"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full"
            onClick={() => toggleDepartment(node.id)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <span className="ml-2 font-medium">{node.name}</span>
        </div>
        
        {isExpanded && (
          <>
            {node.members.length > 0 && renderMemberCards(node.members)}
            {node.children.map((child) => renderDepartment(child, depth + 1))}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="org-chart p-4 bg-muted/30 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Estrutura Organizacional</h3>
      {data.map((node) => renderDepartment(node))}
    </div>
  );
};

export default OrgChart;
