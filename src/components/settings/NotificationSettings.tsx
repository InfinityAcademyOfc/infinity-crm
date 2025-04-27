import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
const NotificationSettings = () => {
  return <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Novos leads</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Receba notificações quando novos leads forem adicionados</p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Atividades de clientes</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Receba notificações sobre atividades de clientes</p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Pagamentos</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Notificações sobre pagamentos recebidos ou pendentes</p>
          </div>
          <Switch />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Lembretes de reuniões</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Receba lembretes antes das reuniões agendadas</p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Alertas por email</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Receba cópias das notificações por email</p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>;
};
export default NotificationSettings;