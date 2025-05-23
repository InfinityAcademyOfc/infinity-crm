
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, UserCheck, UserCog, UserMinus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Interface para os dados do colaborador
interface CollaboratorData {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  permissions?: PermissionSettings;
}

// Interface para as configurações de permissão
interface PermissionSettings {
  canViewDashboard: boolean;
  canManageClients: boolean;
  canManageLeads: boolean;
  canViewFinancial: boolean;
  canEditFinancial: boolean;
  canManageProducts: boolean;
  canManageTeam: boolean;
  canManageSettings: boolean;
}

// Defina os papéis disponíveis
const availableRoles = [
  { value: "admin", label: "Administrador" },
  { value: "manager", label: "Gerente" },
  { value: "seller", label: "Vendedor" },
  { value: "support", label: "Suporte" },
  { value: "viewer", label: "Visualizador" }
];

const defaultPermissions: PermissionSettings = {
  canViewDashboard: true,
  canManageClients: false,
  canManageLeads: false,
  canViewFinancial: false,
  canEditFinancial: false,
  canManageProducts: false,
  canManageTeam: false,
  canManageSettings: false
};

// Props do componente
interface CollaboratorPermissionsFormProps {
  collaborator?: CollaboratorData;
  onSave?: (data: CollaboratorData) => void;
  onCancel?: () => void;
}

const CollaboratorPermissionsForm = ({ 
  collaborator,
  onSave,
  onCancel
}: CollaboratorPermissionsFormProps) => {
  const { toast } = useToast();
  
  // Estado inicial do formulário
  const [formData, setFormData] = useState<CollaboratorData>({
    id: collaborator?.id || "",
    name: collaborator?.name || "",
    email: collaborator?.email || "",
    role: collaborator?.role || "viewer",
    permissions: collaborator?.permissions || {...defaultPermissions}
  });
  
  // Atualizar role
  const handleRoleChange = (role: string) => {
    let updatedPermissions = { ...formData.permissions } as PermissionSettings;
    
    // Configurar permissões conforme o papel selecionado
    switch(role) {
      case "admin":
        updatedPermissions = {
          canViewDashboard: true,
          canManageClients: true,
          canManageLeads: true,
          canViewFinancial: true,
          canEditFinancial: true,
          canManageProducts: true,
          canManageTeam: true,
          canManageSettings: true
        };
        break;
      case "manager":
        updatedPermissions = {
          canViewDashboard: true,
          canManageClients: true,
          canManageLeads: true,
          canViewFinancial: true,
          canEditFinancial: false,
          canManageProducts: true,
          canManageTeam: false,
          canManageSettings: false
        };
        break;
      case "seller":
        updatedPermissions = {
          canViewDashboard: true,
          canManageClients: true,
          canManageLeads: true,
          canViewFinancial: false,
          canEditFinancial: false,
          canManageProducts: false,
          canManageTeam: false,
          canManageSettings: false
        };
        break;
      case "support":
        updatedPermissions = {
          canViewDashboard: true,
          canManageClients: false,
          canManageLeads: false,
          canViewFinancial: false,
          canEditFinancial: false,
          canManageProducts: false,
          canManageTeam: false,
          canManageSettings: false
        };
        break;
      case "viewer":
      default:
        updatedPermissions = { ...defaultPermissions };
        break;
    }
    
    setFormData({
      ...formData,
      role,
      permissions: updatedPermissions
    });
  };
  
  // Toggle para permissão individual
  const handleTogglePermission = (key: keyof PermissionSettings) => {
    if (!formData.permissions) return;
    
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [key]: !formData.permissions[key]
      }
    });
  };
  
  // Salvar alterações
  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    
    toast({
      title: "Permissões atualizadas",
      description: `As permissões para ${formData.name} foram atualizadas com sucesso.`
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="h-5 w-5" />
          Permissões do Colaborador
        </CardTitle>
        <CardDescription>
          Gerencie as permissões e acessos do colaborador {formData.name}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="role">Função/Cargo</Label>
            <Select 
              value={formData.role} 
              onValueChange={handleRoleChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um cargo" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              O cargo define as permissões padrão, que podem ser personalizadas abaixo
            </p>
          </div>
          
          <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Permissões
            </h4>
            
            {formData.permissions && (
              <>
                <div className="flex items-center justify-between">
                  <Label htmlFor="canViewDashboard" className="cursor-pointer">Visualizar Dashboard</Label>
                  <Switch 
                    id="canViewDashboard" 
                    checked={formData.permissions.canViewDashboard} 
                    onCheckedChange={() => handleTogglePermission('canViewDashboard')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="canManageClients" className="cursor-pointer">Gerenciar Clientes</Label>
                  <Switch 
                    id="canManageClients" 
                    checked={formData.permissions.canManageClients} 
                    onCheckedChange={() => handleTogglePermission('canManageClients')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="canManageLeads" className="cursor-pointer">Gerenciar Leads</Label>
                  <Switch 
                    id="canManageLeads" 
                    checked={formData.permissions.canManageLeads} 
                    onCheckedChange={() => handleTogglePermission('canManageLeads')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="canViewFinancial" className="cursor-pointer">Visualizar Financeiro</Label>
                  <Switch 
                    id="canViewFinancial" 
                    checked={formData.permissions.canViewFinancial} 
                    onCheckedChange={() => handleTogglePermission('canViewFinancial')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="canEditFinancial" className="cursor-pointer">Editar Financeiro</Label>
                  <Switch 
                    id="canEditFinancial" 
                    checked={formData.permissions.canEditFinancial} 
                    onCheckedChange={() => handleTogglePermission('canEditFinancial')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="canManageProducts" className="cursor-pointer">Gerenciar Produtos</Label>
                  <Switch 
                    id="canManageProducts" 
                    checked={formData.permissions.canManageProducts} 
                    onCheckedChange={() => handleTogglePermission('canManageProducts')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="canManageTeam" className="cursor-pointer">Gerenciar Equipe</Label>
                  <Switch 
                    id="canManageTeam" 
                    checked={formData.permissions.canManageTeam} 
                    onCheckedChange={() => handleTogglePermission('canManageTeam')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="canManageSettings" className="cursor-pointer">Gerenciar Configurações</Label>
                  <Switch 
                    id="canManageSettings" 
                    checked={formData.permissions.canManageSettings} 
                    onCheckedChange={() => handleTogglePermission('canManageSettings')}
                  />
                </div>
              </>
            )}
            
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleSave}>Salvar Permissões</Button>
      </CardFooter>
    </Card>
  );
};

export default CollaboratorPermissionsForm;
