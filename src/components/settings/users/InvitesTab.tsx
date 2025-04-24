
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Trash2, CheckCircle } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface InvitesTabProps {
  pendingInvites: TeamMember[];
  onRemoveInvite: (id: number) => void;
}

const InvitesTab = ({ pendingInvites, onRemoveInvite }: InvitesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Convites Pendentes</CardTitle>
        <CardDescription>
          Gerencie os convites enviados para novos membros.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingInvites.length > 0 ? (
            <div className="divide-y">
              {pendingInvites.map(member => (
                <div key={member.id} className="py-4 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{member.email}</div>
                    <div className="text-sm text-muted-foreground">
                      Função: {member.role === 'admin' ? 'Administrador' : 
                              member.role === 'editor' ? 'Editor' : 'Visualizador'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 px-2 bg-transparent">
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Reenviar convite</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-8 px-2"
                      onClick={() => onRemoveInvite(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remover convite</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-lg">Sem convites pendentes</h3>
              <p className="text-muted-foreground mt-1">
                Todos os convites foram aceitos ou você ainda não convidou ninguém.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvitesTab;
