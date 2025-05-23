
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientAnalyticsProps {
  analytics: {
    npsData: {
      promoters: number;
      neutrals: number;
      detractors: number;
    };
    averageLTV: number;
    satisfactionAverage: number;
  };
}

export const ClientAnalytics = ({ analytics }: ClientAnalyticsProps) => {
  const npsChartData = [
    {
      name: 'Promotores',
      value: analytics.npsData.promoters,
      color: '#10B981'
    },
    {
      name: 'Neutros',
      value: analytics.npsData.neutrals,
      color: '#F59E0B'
    },
    {
      name: 'Detratores',
      value: analytics.npsData.detractors,
      color: '#EF4444'
    }
  ];

  const ltvData = [
    {
      month: 'LTV Médio',
      value: analytics.averageLTV
    }
  ];

  if (analytics.npsData.promoters === 0 && analytics.npsData.neutrals === 0 && analytics.npsData.detractors === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm">Nenhum dado de NPS disponível</p>
              <p className="text-xs text-muted-foreground mt-1">Adicione avaliações NPS para visualizar</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">LTV Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm">Nenhum dado de LTV disponível</p>
              <p className="text-xs text-muted-foreground mt-1">Adicione dados de receita para calcular LTV</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Satisfação Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm">Nenhum dado de satisfação disponível</p>
              <p className="text-xs text-muted-foreground mt-1">Adicione avaliações de satisfação</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={npsChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {npsChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">LTV Médio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ltvData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Valor']} />
                <Bar dataKey="value" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Satisfação Média</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-3xl font-bold text-primary">
              {analytics.satisfactionAverage > 0 ? analytics.satisfactionAverage.toFixed(1) : '0.0'}
            </div>
            <div className="text-sm text-muted-foreground">de 5.0 estrelas</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
