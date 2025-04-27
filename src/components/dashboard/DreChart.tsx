
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/formatters";

// Mock DRE data
const mockDreData = [
  { name: "Jan", receita: 85000, despesa: 45000, lucro: 40000 },
  { name: "Fev", receita: 92000, despesa: 48000, lucro: 44000 },
  { name: "Mar", receita: 88000, despesa: 50000, lucro: 38000 },
  { name: "Abr", receita: 99000, despesa: 52000, lucro: 47000 },
  { name: "Mai", receita: 103000, despesa: 55000, lucro: 48000 },
  { name: "Jun", receita: 110000, despesa: 57000, lucro: 53000 },
];

const DreChart = () => {
  const [period, setPeriod] = useState("semestre");
  const { toast } = useToast();

  const handleExport = () => {
    // Prepare CSV content
    const headers = ["Período", "Receita", "Despesa", "Lucro"];
    const rows = mockDreData.map(item => [
      item.name,
      item.receita,
      item.despesa,
      item.lucro
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `dre-simplificado-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída",
      description: "Os dados do DRE foram exportados em formato CSV",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">DRE Simplificado</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={handleExport}
          >
            <Download size={16} />
            Exportar CSV
          </Button>
        </div>
        <CardDescription>Demonstrativo de resultados do período</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockDreData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} />
              <YAxis 
                tickFormatter={(value) => `R$${value/1000}k`} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), ""]}
                contentStyle={{ 
                  background: 'var(--background)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '6px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }}
              />
              <Bar dataKey="receita" name="Receita" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesa" name="Despesa" fill="#f87171" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lucro" name="Lucro" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex justify-between w-full text-xs text-muted-foreground">
          <span>Mostrando dados do último semestre</span>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-7 w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="semestre">Semestre</SelectItem>
              <SelectItem value="ano">Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DreChart;
