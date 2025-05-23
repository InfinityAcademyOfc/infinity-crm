
import React, { useState, useEffect } from 'react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const permissionsSchema = z.object({
  role: z.string(),
  canViewSales: z.boolean(),
  canEditSales: z.boolean(),
  canViewClients: z.boolean(),
  canEditClients: z.boolean(),
  canViewFinance: z.boolean(),
  canEditFinance: z.boolean(),
  canViewProduction: z.boolean(),
  canEditProduction: z.boolean(),
  canViewTeam: z.boolean(),
  canEditTeam: z.boolean(),
});

type PermissionsFormValues = z.infer<typeof permissionsSchema>;

interface CollaboratorPermissionsFormProps {
  collaboratorId: string;
  onSave: () => void;
  onCancel: () => void;
}

const CollaboratorPermissionsForm: React.FC<CollaboratorPermissionsFormProps> = ({
  collaboratorId,
  onSave,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Definir valores padrão
  const defaultValues: PermissionsFormValues = {
    role: 'user',
    canViewSales: true,
    canEditSales: false,
    canViewClients: true,
    canEditClients: false,
    canViewFinance: false,
    canEditFinance: false,
    canViewProduction: true,
    canEditProduction: true,
    canViewTeam: false,
    canEditTeam: false,
  };

  const form = useForm<PermissionsFormValues>({
    resolver: zodResolver(permissionsSchema),
    defaultValues,
  });

  // Carregar permissões existentes
  useEffect(() => {
    const loadPermissions = async () => {
      if (!collaboratorId) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('role, permissions')
          .eq('id', collaboratorId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          const { role, permissions } = data;
          
          form.reset({
            role: role || 'user',
            canViewSales: permissions?.canViewSales ?? defaultValues.canViewSales,
            canEditSales: permissions?.canEditSales ?? defaultValues.canEditSales,
            canViewClients: permissions?.canViewClients ?? defaultValues.canViewClients,
            canEditClients: permissions?.canEditClients ?? defaultValues.canEditClients,
            canViewFinance: permissions?.canViewFinance ?? defaultValues.canViewFinance,
            canEditFinance: permissions?.canEditFinance ?? defaultValues.canEditFinance,
            canViewProduction: permissions?.canViewProduction ?? defaultValues.canViewProduction,
            canEditProduction: permissions?.canEditProduction ?? defaultValues.canEditProduction,
            canViewTeam: permissions?.canViewTeam ?? defaultValues.canViewTeam,
            canEditTeam: permissions?.canEditTeam ?? defaultValues.canEditTeam,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar permissões:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as permissões do colaborador",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadPermissions();
  }, [collaboratorId, form, toast]);

  // Salvar permissões
  const onSubmit = async (data: PermissionsFormValues) => {
    if (!collaboratorId) return;
    
    try {
      setLoading(true);
      
      const { role, ...permissions } = data;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          role,
          permissions,
          updated_at: new Date().toISOString()
        })
        .eq('id', collaboratorId);
      
      if (error) throw error;
      
      toast({
        title: "Permissões atualizadas",
        description: "As permissões do colaborador foram atualizadas com sucesso",
      });
      
      onSave();
    } catch (error) {
      console.error("Erro ao atualizar permissões:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as permissões do colaborador",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="user">Usuário</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          <div className="space-y-3">
            <h3 className="font-medium">Funil de Vendas</h3>
            <FormField
              control={form.control}
              name="canViewSales"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="cursor-pointer">Visualizar</FormLabel>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="canEditSales"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="cursor-pointer">Editar</FormLabel>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                      disabled={!form.watch('canViewSales')}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Clientes</h3>
            <FormField
              control={form.control}
              name="canViewClients"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="cursor-pointer">Visualizar</FormLabel>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="canEditClients"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="cursor-pointer">Editar</FormLabel>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                      disabled={!form.watch('canViewClients')}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Financeiro</h3>
            <FormField
              control={form.control}
              name="canViewFinance"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="cursor-pointer">Visualizar</FormLabel>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="canEditFinance"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="cursor-pointer">Editar</FormLabel>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                      disabled={!form.watch('canViewFinance')}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Produção</h3>
            <FormField
              control={form.control}
              name="canViewProduction"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="cursor-pointer">Visualizar</FormLabel>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="canEditProduction"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="cursor-pointer">Editar</FormLabel>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                      disabled={!form.watch('canViewProduction')}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Equipe</h3>
            <FormField
              control={form.control}
              name="canViewTeam"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="cursor-pointer">Visualizar</FormLabel>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="canEditTeam"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="cursor-pointer">Editar</FormLabel>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                      disabled={!form.watch('canViewTeam')}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Permissões"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CollaboratorPermissionsForm;
