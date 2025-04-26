
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart as PieChartIcon } from "lucide-react";

interface FunnelChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const FunnelChart = ({
  data
}: FunnelChartProps) => {
  const COLORS = ['#4361ee', '#7209b7', '#9d4edd', '#3a0ca3', '#4cc9f0'];
  
  return <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Conversão do Funil</CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <PieChartIcon size={16} />
            Exportar
          </Button>
        </div>
        <CardDescription>Distribuição de leads por etapa</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data} 
                cx="50%" 
                cy="50%" 
                innerRadius={60} 
                outerRadius={80} 
                paddingAngle={5} 
                dataKey="value" 
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip 
                formatter={value => [`${value} leads`, "Quantidade"]} 
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>;
};

export default FunnelChart;
