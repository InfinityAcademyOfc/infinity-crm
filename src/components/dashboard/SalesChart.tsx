
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";

interface SalesChartProps {
  data: Array<{
    month: string;
    value: number;
  }>;
}

const SalesChart = ({ data }: SalesChartProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Vendas por Mês</CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <BarChart3 size={16} />
            Exportar
          </Button>
        </div>
        <CardDescription>Performance de vendas nos últimos 12 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} />
              <YAxis tickFormatter={(value) => `R$${value/1000}k`} tickLine={false} axisLine={false} />
              <Tooltip 
                formatter={(value) => [formatCurrency(Number(value)), "Vendas"]}
                contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="value" fill="#4361ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
