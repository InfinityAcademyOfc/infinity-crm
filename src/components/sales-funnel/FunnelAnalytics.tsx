
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface FunnelAnalyticsProps {
  leads: any[];
  stages: any[];
}

export const FunnelAnalytics = ({ leads, stages }: FunnelAnalyticsProps) => {
  const getStageData = () => {
    return stages.map(stage => ({
      name: stage.name,
      count: leads.filter(lead => lead.stage === stage.name).length,
      value: leads.filter(lead => lead.stage === stage.name).reduce((sum, lead) => sum + (lead.value || 0), 0)
    }));
  };

  const conversionRate = leads.length > 0 ? 
    Math.round((leads.filter(lead => lead.stage.toLowerCase().includes('won')).length / leads.length) * 100) : 0;

  const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{leads.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ {totalValue.toLocaleString('pt-BR')}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{conversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leads por Estágio</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getStageData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Valor</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getStageData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getStageData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
