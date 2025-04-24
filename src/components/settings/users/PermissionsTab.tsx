
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const PermissionsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissões de Acesso</CardTitle>
        <CardDescription>
          Configure o que cada nível de acesso pode visualizar e editar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Administrador</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-dashboard">Dashboard</Label>
                <Switch id="admin-dashboard" defaultChecked disabled />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-finance">Financeiro</Label>
                <Switch id="admin-finance" defaultChecked disabled />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-clients">Clientes</Label>
                <Switch id="admin-clients" defaultChecked disabled />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-settings">Configurações</Label>
                <Switch id="admin-settings" defaultChecked disabled />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Editor</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="editor-dashboard">Dashboard</Label>
                <Switch id="editor-dashboard" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="editor-finance">Financeiro</Label>
                <Switch id="editor-finance" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="editor-clients">Clientes</Label>
                <Switch id="editor-clients" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="editor-settings">Configurações</Label>
                <Switch id="editor-settings" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Visualizador</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="viewer-dashboard">Dashboard (somente visualização)</Label>
                <Switch id="viewer-dashboard" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="viewer-finance">Financeiro (somente visualização)</Label>
                <Switch id="viewer-finance" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="viewer-clients">Clientes (somente visualização)</Label>
                <Switch id="viewer-clients" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="viewer-settings">Configurações (somente visualização)</Label>
                <Switch id="viewer-settings" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button>
            Salvar Configurações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionsTab;
