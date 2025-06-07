
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, DollarSign, TrendingUp } from 'lucide-react';

const SalesFunnel = () => {
  const funnelStages = [
    { name: "Leads", count: 245, color: "bg-blue-500" },
    { name: "Qualificados", count: 89, color: "bg-yellow-500" },
    { name: "Propostas", count: 34, color: "bg-orange-500" },
    { name: "Negociação", count: 12, color: "bg-red-500" },
    { name: "Fechados", count: 8, color: "bg-green-500" }
  ];

  const mockDeals = [
    { id: 1, client: "João Silva", value: "R$ 15.000", stage: "Negociação", probability: "80%" },
    { id: 2, client: "Maria Santos", value: "R$ 8.500", stage: "Propostas", probability: "60%" },
    { id: 3, client: "Pedro Costa", value: "R$ 22.000", stage: "Qualificados", probability: "40%" },
    { id: 4, client: "Ana Lima", value: "R$ 12.300", stage: "Negociação", probability: "90%" }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Funil de Vendas</h1>
          <p className="text-muted-foreground">Gerencie seu pipeline de vendas</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nova Oportunidade
        </Button>
      </div>

      {/* Funil Visual */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {funnelStages.map((stage, index) => (
              <div key={index} className="text-center">
                <div className={`${stage.color} rounded-lg p-6 mb-2`}>
                  <div className="text-white text-2xl font-bold">{stage.count}</div>
                </div>
                <h3 className="font-medium">{stage.name}</h3>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.5%</div>
            <p className="text-xs text-muted-foreground">+2.1% desde o mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Valor Total Pipeline</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 284.500</div>
            <p className="text-xs text-muted-foreground">+12.3% desde o mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Oportunidades Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">388</div>
            <p className="text-xs text-muted-foreground">+8 novas esta semana</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Negócios */}
      <Card>
        <CardHeader>
          <CardTitle>Oportunidades em Andamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDeals.map((deal) => (
              <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{deal.client}</h4>
                  <p className="text-sm text-muted-foreground">{deal.stage}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">{deal.value}</div>
                  <div className="text-sm text-green-600">{deal.probability}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesFunnel;
