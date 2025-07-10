
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ChevronRight, Users, UserPlus, Edit } from "lucide-react";
import { teamService } from "@/services/api/teamService";
import { TeamHierarchy } from "@/types/team";
import { useToast } from "@/hooks/use-toast";

interface TeamHierarchyViewProps {
  companyId: string;
}

export const TeamHierarchyView = ({ companyId }: TeamHierarchyViewProps) => {
  const [hierarchy, setHierarchy] = useState<TeamHierarchy[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadHierarchy();
  }, [companyId]);

  const loadHierarchy = async () => {
    try {
      setLoading(true);
      const data = await teamService.getTeamHierarchy(companyId);
      setHierarchy(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar a hierarquia da equipe",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const buildHierarchyTree = (members: TeamHierarchy[]): any[] => {
    const memberMap = new Map<string, any>();
    const roots: any[] = [];

    // Create member objects
    members.forEach(member => {
      memberMap.set(member.id, {
        ...member,
        children: []
      });
    });

    // Build tree structure
    members.forEach(member => {
      const memberNode = memberMap.get(member.id);
      if (member.manager_id && memberMap.has(member.manager_id)) {
        const manager = memberMap.get(member.manager_id);
        manager.children.push(memberNode);
      } else {
        roots.push(memberNode);
      }
    });

    return roots;
  };

  const renderMember = (member: any, level: number = 0) => {
    const hasChildren = member.children && member.children.length > 0;
    const isExpanded = expandedNodes.has(member.id);
    const indentLevel = level * 24;

    return (
      <div key={member.id} className="mb-2">
        <Card className="p-4" style={{ marginLeft: `${indentLevel}px` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(member.id)}
                  className="p-1 h-6 w-6"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              {!hasChildren && <div className="w-6"></div>}
              
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  {member.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-muted-foreground">{member.email}</div>
                {member.position && (
                  <div className="text-xs text-muted-foreground">{member.position}</div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{member.role}</Badge>
              {member.department && (
                <Badge variant="outline">{member.department}</Badge>
              )}
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {member.manager_name && (
            <div className="mt-2 text-xs text-muted-foreground">
              Reporta para: {member.manager_name}
            </div>
          )}
        </Card>
        
        {hasChildren && isExpanded && (
          <div className="mt-2">
            {member.children.map((child: any) => renderMember(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p>Carregando hierarquia da equipe...</p>
        </div>
      </div>
    );
  }

  const hierarchyTree = buildHierarchyTree(hierarchy);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Hierarquia da Equipe</h2>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Adicionar Membro
        </Button>
      </div>
      
      {hierarchyTree.length === 0 ? (
        <Card className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Nenhum membro encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Adicione membros à sua equipe para visualizar a hierarquia
          </p>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Primeiro Membro
          </Button>
        </Card>
      ) : (
        <div className="space-y-2">
          {hierarchyTree.map(member => renderMember(member))}
        </div>
      )}
    </div>
  );
};
