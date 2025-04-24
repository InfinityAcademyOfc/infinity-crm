
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, UserCog, MessageSquare, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeamMemberEditorProps {
  member: {
    id: string | number;
    name: string;
    email: string;
    role: string;
    department?: string;
    status?: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (member: any) => void;
}

const TeamMemberEditor = ({ member, open, onOpenChange, onSave }: TeamMemberEditorProps) => {
  const [currentRole, setCurrentRole] = useState(member.role);
  const [permissions, setPermissions] = useState({
    dashboard: true,
    sales: true,
    clients: true,
    production: true,
    finance: member.role === 'admin',
    settings: member.role === 'admin',
    team: member.role === 'admin' || member.role === 'manager'
  });
  
  const [kanbanVisibility, setKanbanVisibility] = useState({
    salesFunnel: true,
    ltvFunnel: member.role !== 'viewer',
    productionKanban: member.role !== 'viewer'
  });
  
  const [dataAccess, setDataAccess] = useState({
    viewOtherLeads: member.role !== 'viewer',
    editOtherLeads: member.role === 'admin' || member.role === 'manager',
    viewTeamDashboard: member.role !== 'viewer',
    viewFinancialData: member.role === 'admin',
    exportData: member.role !== 'viewer'
  });
  
  const { toast } = useToast();
  
  const handleRoleChange = (role: string) => {
    setCurrentRole(role);
    
    // Update permissions based on selected role
    switch (role) {
      case 'admin':
        setPermissions({
          dashboard: true,
          sales: true,
          clients: true,
          production: true,
          finance: true,
          settings: true,
          team: true
        });
        setDataAccess({
          viewOtherLeads: true,
          editOtherLeads: true,
          viewTeamDashboard: true,
          viewFinancialData: true,
          exportData: true
        });
        setKanbanVisibility({
          salesFunnel: true,
          ltvFunnel: true,
          productionKanban: true
        });
        break;
        
      case 'manager':
        setPermissions({
          dashboard: true,
          sales: true,
          clients: true,
          production: true,
          finance: false,
          settings: false,
          team: true
        });
        setDataAccess({
          viewOtherLeads: true,
          editOtherLeads: true,
          viewTeamDashboard: true,
          viewFinancialData: false,
          exportData: true
        });
        setKanbanVisibility({
          salesFunnel: true,
          ltvFunnel: true,
          productionKanban: true
        });
        break;
        
      case 'editor':
        setPermissions({
          dashboard: true,
          sales: true,
          clients: true,
          production: true,
          finance: false,
          settings: false,
          team: false
        });
        setDataAccess({
          viewOtherLeads: true,
          editOtherLeads: false,
          viewTeamDashboard: false,
          viewFinancialData: false,
          exportData: true
        });
        setKanbanVisibility({
          salesFunnel: true,
          ltvFunnel: true,
          productionKanban: true
        });
        break;
        
      case 'viewer':
        setPermissions({
          dashboard: true,
          sales: true,
          clients: true,
          production: true,
          finance: false,
          settings: false,
          team: false
        });
        setDataAccess({
          viewOtherLeads: false,
          editOtherLeads: false,
          viewTeamDashboard: false,
          viewFinancialData: false,
          exportData: false
        });
        setKanbanVisibility({
          salesFunnel: true,
          ltvFunnel: false,
          productionKanban: false
        });
        break;
    }
  };
  
  const handleSave = () => {
    const updatedMember = {
      ...member,
      role: currentRole,
      permissions,
      kanbanVisibility,
      dataAccess
    };
    
    if (onSave) {
      onSave(updatedMember);
    }
    
    toast({
      title: "Alterações salvas",
      description: `As permissões de ${member.name} foram atualizadas.`,
    });
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserCog className="mr-2 h-5 w-5" />
            Editar Membro da Equipe
          </DialogTitle>
          <DialogDescription>
            Configure as permissões e acesso de {member.name}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="roles" className="mt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="roles">Função</TabsTrigger>
            <TabsTrigger value="modules">Módulos</TabsTrigger>
            <TabsTrigger value="data">Acesso a Dados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="roles" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Função do membro</Label>
              <Select value={currentRole} onValueChange={handleRoleChange}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Card className="bg-muted/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Descrição da função
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {currentRole === 'admin' && (
                  <p>Acesso total a todos os módulos, dados e configurações do sistema. Pode gerenciar usuários e definir permissões.</p>
                )}
                {currentRole === 'manager' && (
                  <p>Pode gerenciar equipes e visualizar dados de toda a equipe, mas não tem acesso a configurações do sistema ou informações financeiras detalhadas.</p>
                )}
                {currentRole === 'editor' && (
                  <p>Pode editar leads, clientes e tarefas, mas apenas visualiza os dados de toda a equipe sem alterá-los.</p>
                )}
                {currentRole === 'viewer' && (
                  <p>Acesso somente leitura. Pode visualizar apenas seus próprios leads e tarefas atribuídas.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="modules" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="dashboard-perm" className="flex items-center">
                  Dashboard
                </Label>
                <Switch id="dashboard-perm" checked={permissions.dashboard} 
                  onCheckedChange={(checked) => setPermissions({...permissions, dashboard: checked})} />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sales-perm" className="flex items-center">
                  Vendas
                </Label>
                <Switch id="sales-perm" checked={permissions.sales} 
                  onCheckedChange={(checked) => setPermissions({...permissions, sales: checked})} />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="clients-perm" className="flex items-center">
                  Clientes
                </Label>
                <Switch id="clients-perm" checked={permissions.clients} 
                  onCheckedChange={(checked) => setPermissions({...permissions, clients: checked})} />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="production-perm" className="flex items-center">
                  Produção
                </Label>
                <Switch id="production-perm" checked={permissions.production} 
                  onCheckedChange={(checked) => setPermissions({...permissions, production: checked})} />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="finance-perm" className="flex items-center">
                  Financeiro
                </Label>
                <Switch id="finance-perm" checked={permissions.finance} 
                  onCheckedChange={(checked) => setPermissions({...permissions, finance: checked})} />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="settings-perm" className="flex items-center">
                  Configurações
                </Label>
                <Switch id="settings-perm" checked={permissions.settings} 
                  onCheckedChange={(checked) => setPermissions({...permissions, settings: checked})} />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="team-perm" className="flex items-center">
                  Gerenciar Equipe
                </Label>
                <Switch id="team-perm" checked={permissions.team} 
                  onCheckedChange={(checked) => setPermissions({...permissions, team: checked})} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-4">
            <Card className="bg-muted/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Visualização de Kanbans</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sales-kanban" className="text-sm">
                    Funil de Vendas
                  </Label>
                  <Switch id="sales-kanban" checked={kanbanVisibility.salesFunnel} 
                    onCheckedChange={(checked) => setKanbanVisibility({...kanbanVisibility, salesFunnel: checked})} />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="ltv-kanban" className="text-sm">
                    Funil de LTV
                  </Label>
                  <Switch id="ltv-kanban" checked={kanbanVisibility.ltvFunnel} 
                    onCheckedChange={(checked) => setKanbanVisibility({...kanbanVisibility, ltvFunnel: checked})} />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="production-kanban" className="text-sm">
                    Kanban de Produção
                  </Label>
                  <Switch id="production-kanban" checked={kanbanVisibility.productionKanban} 
                    onCheckedChange={(checked) => setKanbanVisibility({...kanbanVisibility, productionKanban: checked})} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Acesso a Dados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="view-other-leads" className="text-sm">
                    Visualizar leads de outros usuários
                  </Label>
                  <Switch id="view-other-leads" checked={dataAccess.viewOtherLeads} 
                    onCheckedChange={(checked) => setDataAccess({...dataAccess, viewOtherLeads: checked})} />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-other-leads" className="text-sm">
                    Editar leads de outros usuários
                  </Label>
                  <Switch id="edit-other-leads" checked={dataAccess.editOtherLeads} 
                    onCheckedChange={(checked) => setDataAccess({...dataAccess, editOtherLeads: checked})} />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="view-team-dashboard" className="text-sm">
                    Visualizar dashboard da equipe
                  </Label>
                  <Switch id="view-team-dashboard" checked={dataAccess.viewTeamDashboard} 
                    onCheckedChange={(checked) => setDataAccess({...dataAccess, viewTeamDashboard: checked})} />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="view-financial" className="text-sm">
                    Visualizar dados financeiros
                  </Label>
                  <Switch id="view-financial" checked={dataAccess.viewFinancialData} 
                    onCheckedChange={(checked) => setDataAccess({...dataAccess, viewFinancialData: checked})} />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="export-data" className="text-sm">
                    Exportar dados
                  </Label>
                  <Switch id="export-data" checked={dataAccess.exportData} 
                    onCheckedChange={(checked) => setDataAccess({...dataAccess, exportData: checked})} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} className="gap-1">
            <Check className="h-4 w-4" /> Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberEditor;
