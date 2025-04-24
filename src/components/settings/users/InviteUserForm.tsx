
import React, { useState } from "react";
import { Mail, Shield, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InviteUserFormProps {
  onInvite: (email: string, role: string) => void;
}

const InviteUserForm = ({ onInvite }: InviteUserFormProps) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite(inviteEmail, inviteRole);
    setInviteEmail('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Convidar Membro</CardTitle>
        <CardDescription>
          Adicione novos membros à sua equipe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="colaborador@email.com"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Função</Label>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-muted-foreground" />
                <Select
                  value={inviteRole}
                  onValueChange={setInviteRole}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Convidar
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InviteUserForm;
