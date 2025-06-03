
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Badge } from '@/components/ui/badge';

const LeadsReport = () => {
  const conversionData = [
    { stage: 'Leads', count: 1250, conversion: 100 },
    { stage: 'Qualificados', count: 875, conversion: 70 },
    { stage: 'Propostas', count: 438, conversion: 35 },
    { stage: 'Negociação', count: 219, conversion: 17.5 },
    { stage: 'Fechados', count: 125, conversion: 10 }
  ];

  const weeklyLeads = [
    { week: 'Sem 1', leads: 45, qualified: 32 },
    { week: 'Sem 2', leads: 52, qualified: 38 },
    { week: 'Sem 3', leads: 48, qualified: 35 },
    { week: 'Sem 4', leads: 61, qualified: 44 }
  ];

  const leadSources = [
    { source: 'Website', total: 425, quality: 85 },
    { source: 'Facebook Ads', total: 380, quality: 72 },
    { source: 'Google Ads', total: 290, quality: 88 },
    { source: 'LinkedIn', total: 155, quality: 91 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Funil de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionData.map((stage, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{stage.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{stage.count}</span>
                      <Badge variant="outline">{stage.conversion}%</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${stage.conversion}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads por Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyLeads}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="leads" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="qualified" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Análise por Origem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leadSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{source.source}</h4>
                  <p className="text-sm text-muted-foreground">{source.total} leads</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Qualidade</p>
                    <Badge variant={source.quality > 80 ? 'default' : source.quality > 70 ? 'secondary' : 'destructive'}>
                      {source.quality}%
                    </Badge>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${source.quality}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Taxa de Conversão Geral</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-primary">23.4%</div>
            <p className="text-sm text-muted-foreground mt-2">↑ 2.1% vs. mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Tempo Médio no Funil</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-primary">18</div>
            <p className="text-sm text-muted-foreground mt-2">dias para conversão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Valor Médio por Lead</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-primary">R$ 1.247</div>
            <p className="text-sm text-muted-foreground mt-2">↑ 8.5% vs. mês anterior</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadsReport;
