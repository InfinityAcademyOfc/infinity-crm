
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Mail, Phone, Edit, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TeamManagement = () => {
  const { user, companyProfile } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  const companyId = companyProfile?.company_id || user?.id || "";

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['team-members', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', companyId)
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
    staleTime: 30000,
  });

  const filteredMembers = teamMembers.filter(member =>
    member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const memberData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      role: formData.get("role") as string,
      department: formData.get("department") as string,
      status: formData.get("status") as string,
    };

    try {
      if (editingMember) {
        const { error } = await supabase
          .from('profiles')
          .update(memberData)
          .eq('id', editingMember.id);
        
        if (error) throw error;
        toast.success("Membro atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from('profiles')
          .insert({
            ...memberData,
            company_id: companyId,
          });
        
        if (error) throw error;
        toast.success("Membro criado com sucesso!");
      }
      
      queryClient.invalidateQueries({ queryKey: ['team-members', companyId] });
      setDialogOpen(false);
      setEditingMember(null);
      form.reset();
    } catch (error) {
      toast.error("Erro ao salvar membro da equipe");
    }
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleDelete = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', memberId);
      
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['team-members', companyId] });
      toast.success("Membro removido com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover membro");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Equipe</h1>
          <p className="text-muted-foreground">
            Gerencie os membros da sua equipe
          </p>
        </div>
        
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Membro
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar membros..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback>
                      {member.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription>{member.department}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(member)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{member.phone}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <Badge className={getRoleColor(member.role)}>
                    {member.role === 'admin' ? 'Administrador' : 
                     member.role === 'manager' ? 'Gerente' : 'Usuário'}
                  </Badge>
                  <Badge className={getStatusColor(member.status)}>
                    {member.status === 'active' ? 'Ativo' : 
                     member.status === 'inactive' ? 'Inativo' : 'Pendente'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          setEditingMember(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMember ? 'Editar Membro' : 'Novo Membro'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do membro da equipe.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome*</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingMember?.name || ""}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={editingMember?.email || ""}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={editingMember?.phone || ""}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Função*</Label>
                <Select name="role" defaultValue={editingMember?.role || "user"} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status*</Label>
                <Select name="status" defaultValue={editingMember?.status || "active"} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="department">Departamento</Label>
              <Select name="department" defaultValue={editingMember?.department || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="rh">Recursos Humanos</SelectItem>
                  <SelectItem value="operacoes">Operações</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingMember ? 'Atualizar' : 'Criar'} Membro
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
