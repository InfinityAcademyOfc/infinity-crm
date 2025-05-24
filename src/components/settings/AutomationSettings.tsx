
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Zap, Clock, Users, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AutomationSettings = () => {
  const { user, company } = useAuth();
  const [automations, setAutomations] = useState([
    {
      id: "1",
      name: "Boas-vindas para novos leads",
      description: "Envia email automático quando um novo lead é criado",
      enabled: true,
      trigger: "Novo lead",
      action: "Enviar email",
      lastRun: "Há 2 horas"
    },
    {
      id: "2", 
      name: "Follow-up de proposta",
      description: "Lembra de fazer follow-up 3 dias após enviar proposta",
      enabled: true,
      trigger: "Proposta enviada",
      action: "Criar tarefa",
      lastRun: "Ontem"
    },
    {
      id: "3",
      name: "Notificação de cliente inativo",
      description: "Alerta quando cliente não tem contato há 30 dias",
      enabled: false,
      trigger: "Cliente inativo",
      action: "Enviar notificação",
      lastRun: "Nunca"
    }
  ]);

  const toggleAutomation = (id: string) => {
    setAutomations(prev => 
      prev.map(auto => 
        auto.id === id ? { ...auto, enabled: !auto.enabled } : auto
      )
    );
  };

  const automationTypes = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email Marketing",
      description: "Envios automáticos de email",
      count: 2
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Gestão de Leads",
      description: "Automações do funil de vendas",
      count: 3
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Lembretes",
      description: "Notificações e tarefas automáticas",
      count: 1
    }
  ];

  if (!user || !company) {
    return (
      <div className="p-6 text-center animate-fade-in">
        <p className="text-muted-foreground">Faça login para configurar automações</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Automações</h2>
          <p className="text-muted-foreground mt-1">
            Configure fluxos automáticos para seu CRM
          </p>
        </div>
        <Button className="hover-scale transition-all duration-200">
          <Plus className="h-4 w-4 mr-2" />
          Nova Automação
        </Button>
      </div>

      {/* Automation Types */}
      <div className="grid gap-4 md:grid-cols-3">
        {automationTypes.map((type, index) => (
          <Card 
            key={type.title} 
            className="hover:shadow-md transition-all duration-200 cursor-pointer hover-scale animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {type.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
                <Badge variant="secondary">{type.count}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Automations */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Automações Ativas</CardTitle>
          <CardDescription>
            Gerencie suas automações existentes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {automations.map((automation, index) => (
            <div 
              key={automation.id} 
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200 animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{automation.name}</h4>
                  <p className="text-sm text-muted-foreground">{automation.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {automation.trigger}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {automation.action}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Última execução: {automation.lastRun}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={automation.enabled}
                  onCheckedChange={() => toggleAutomation(automation.id)}
                />
                <Button variant="ghost" size="sm" className="hover-scale transition-all duration-200">
                  Editar
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationSettings;
