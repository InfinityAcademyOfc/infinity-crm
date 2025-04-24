
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, MessageSquare, Mail, Phone, Briefcase } from "lucide-react";
import TeamMemberEditor from "./TeamMemberEditor";
import TeamMemberFeedback from "./TeamMemberFeedback";

interface TeamMember {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department?: string;
  phone?: string;
  status?: string;
}

interface TeamGridViewProps {
  members: TeamMember[];
  onUpdateMember?: (member: TeamMember) => void;
}

export const TeamGridView = ({ members, onUpdateMember }: TeamGridViewProps) => {
  const [editMember, setEditMember] = useState<TeamMember | null>(null);
  const [feedbackMember, setFeedbackMember] = useState<TeamMember | null>(null);
  
  const handleOpenEditor = (member: TeamMember) => {
    setEditMember(member);
  };
  
  const handleOpenFeedback = (member: TeamMember) => {
    setFeedbackMember(member);
  };
  
  const handleSaveMember = (updatedMember: TeamMember) => {
    if (onUpdateMember) {
      onUpdateMember(updatedMember);
    }
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500 hover:bg-red-600">Admin</Badge>;
      case 'manager':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Gerente</Badge>;
      case 'editor':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Editor</Badge>;
      case 'viewer':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Visualizador</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };
  
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status.toLowerCase()) {
      case 'active':
      case 'ativo':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Ativo</Badge>;
      case 'pending':
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pendente</Badge>;
      case 'inactive':
      case 'inativo':
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member) => (
        <Card key={member.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 flex justify-between items-start">
              <div className="flex items-center">
                <Avatar className="h-14 w-14 border-2 border-white">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 text-white">
                  <h3 className="font-medium text-lg">{member.name}</h3>
                  <div className="flex gap-1 mt-1">
                    {getRoleBadge(member.role)}
                    {getStatusBadge(member.status)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{member.email}</span>
              </div>
              
              {member.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{member.phone}</span>
                </div>
              )}
              
              {member.department && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{member.department}</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-border p-3 flex justify-between bg-muted/30">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={() => handleOpenEditor(member)}
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={() => handleOpenFeedback(member)}
              >
                <MessageSquare className="h-4 w-4" />
                Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Edit Member Dialog */}
      {editMember && (
        <TeamMemberEditor
          member={editMember}
          open={!!editMember}
          onOpenChange={(open) => !open && setEditMember(null)}
          onSave={handleSaveMember}
        />
      )}
      
      {/* Feedback Dialog */}
      {feedbackMember && (
        <TeamMemberFeedback
          member={feedbackMember}
          open={!!feedbackMember}
          onOpenChange={(open) => !open && setFeedbackMember(null)}
        />
      )}
    </div>
  );
};
