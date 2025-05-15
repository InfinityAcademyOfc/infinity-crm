
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, RefreshCw } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const leadsData = [
  { name: 'Jan', meta: 32, google: 18 },
  { name: 'Fev', meta: 38, google: 24 },
  { name: 'Mar', meta: 30, google: 22 },
  { name: 'Abr', meta: 42, google: 28 },
  { name: 'Mai', meta: 35, google: 32 },
  { name: 'Jun', meta: 48, google: 36 },
];

const conversionData = [
  { name: 'Prospect', value: 120 },
  { name: 'Qualificação', value: 85 },
  { name: 'Proposta', value: 42 },
  { name: 'Negociação', value: 28 },
  { name: 'Fechado', value: 15 },
];

const sourcePieData = [
  { name: 'Facebook Ads', value: 45 },
  { name: 'Instagram Ads', value: 32 },
  { name: 'Google Search', value: 38 },
  { name: 'Google Display', value: 18 },
  { name: 'Desconhecido', value: 7 },
];

const AdsAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium">Análise de Leads de Anúncios</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Visão geral dos leads capturados através de campanhas de anúncios.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="last30days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Últimos 7 dias</SelectItem>
              <SelectItem value="last30days">Últimos 30 dias</SelectItem>
              <SelectItem value="last90days">Últimos 90 dias</SelectItem>
              <SelectItem value="thisYear">Este ano</SelectItem>
              <SelectItem value="allTime">Todo o período</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw size={16} />
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            <span>Exportar</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total de Leads</CardTitle>
            <CardDescription>Número total de leads capturados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">283</div>
              <div className="text-sm text-green-600 dark:text-green-400 flex items-center">
                +24% <span className="ml-1">vs. último mês</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Custo por Lead</CardTitle>
            <CardDescription>Média de investimento por lead</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">R$ 28,45</div>
              <div className="text-sm text-green-600 dark:text-green-400 flex items-center">
                -5.2% <span className="ml-1">vs. último mês</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Taxa de Conversão</CardTitle>
            <CardDescription>Lead para cliente fechado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">12.4%</div>
              <div className="text-sm text-red-600 dark:text-red-400 flex items-center">
                -2.1% <span className="ml-1">vs. último mês</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Leads por Plataforma</CardTitle>
            <CardDescription>Distribuição mensal de leads capturados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={leadsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)', 
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="meta" name="Meta Ads" fill="#4361ee" />
                  <Bar dataKey="google" name="Google Ads" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Fontes de Leads</CardTitle>
            <CardDescription>Distribuição por plataforma de origem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourcePieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourcePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} leads`, "Quantidade"]}
                    contentStyle={{ 
                      backgroundColor: 'var(--background)', 
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Funil de Conversão</CardTitle>
          <CardDescription>Jornada dos leads do primeiro contato até a conversão</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={conversionData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                />
                <Bar dataKey="value" fill="#4361ee" name="Leads" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-sm text-gray-500 mt-4">
            Taxa média de conversão entre etapas: 65%
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdsAnalytics;
