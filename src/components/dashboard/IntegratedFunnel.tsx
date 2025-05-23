
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Lead } from "@/types/lead";

const COLORS = ["#4f46e5", "#0891b2", "#2dd4bf", "#4ade80", "#facc15", "#f97316"];

interface IntegratedFunnelProps {
  leadData?: Lead[];
}

const IntegratedFunnel = ({ leadData = [] }: IntegratedFunnelProps) => {
  // Processar dados reais para o gráfico
  const processLeadData = () => {
    const statusCounts: Record<string, number> = {};
    
    // Contar leads por status
    leadData.forEach(lead => {
      const status = lead.status || 'undefined';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    // Converter para formato de gráfico
    return Object.entries(statusCounts).map(([name, value]) => ({
      name: getStatusLabel(name),
      value
    }));
  };
  
  // Obter rótulo amigável para status
  const getStatusLabel = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'new': return 'Novos';
      case 'contacted': return 'Contactados';
      case 'qualified': return 'Qualificados';
      case 'proposal': return 'Proposta';
      case 'negotiation': return 'Negociação';
      case 'won': return 'Ganhos';
      case 'lost': return 'Perdidos';
      default: return status;
    }
  };
  
  // Calcular taxa de conversão
  const calculateConversionRate = (): number => {
    const wonLeads = leadData.filter(lead => lead.status?.toLowerCase() === 'won').length;
    return leadData.length > 0 ? Math.round((wonLeads / leadData.length) * 100) : 0;
  };
  
  const data = processLeadData();
  const conversionRate = calculateConversionRate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Funil de Vendas</CardTitle>
        <CardDescription>Distribuição de leads por etapa</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} lead(s)`, "Quantidade"]}
                  contentStyle={{
                    borderRadius: "6px",
                    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Sem dados de leads disponíveis</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="grid grid-cols-2 w-full">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total de Leads</p>
            <p className="text-2xl font-bold">{leadData.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
            <p className="text-2xl font-bold">{conversionRate}%</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default IntegratedFunnel;
