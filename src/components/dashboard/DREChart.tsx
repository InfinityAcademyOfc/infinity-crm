
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { useToast } from "@/hooks/use-toast";

interface DREChartProps {
  transactions?: any[]; // Made transactions optional
}

// Mock data para o DRE
const mockDREData = [{
  name: 'Jan',
  receita: 75000,
  custos: 45000,
  lucro: 30000
}, {
  name: 'Fev',
  receita: 82000,
  custos: 48000,
  lucro: 34000
}, {
  name: 'Mar',
  receita: 78000,
  custos: 47000,
  lucro: 31000
}, {
  name: 'Abr',
  receita: 94000,
  custos: 53000,
  lucro: 41000
}, {
  name: 'Mai',
  receita: 85000,
  custos: 50000,
  lucro: 35000
}, {
  name: 'Jun',
  receita: 89000,
  custos: 51000,
  lucro: 38000
}];

const DREChart = ({ transactions = [] }: DREChartProps) => {
  const { toast } = useToast();
  
  const handleExport = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add headers
    csvContent += "Mês,Receita,Custos,Lucro\n";

    // Add data rows
    mockDREData.forEach(item => {
      csvContent += `${item.name},${item.receita},${item.custos},${item.lucro}\n`;
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dre-simplificado-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);

    // Download CSV file
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Exportação concluída",
      description: "Os dados do DRE foram exportados com sucesso para CSV.",
      duration: 2000 // 2 segundos conforme solicitado
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">DRE Simplificado</CardTitle>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
            <Download size={16} />
            Exportar
          </Button>
        </div>
        <CardDescription>Demonstração de Resultados do Exercício</CardDescription>
      </CardHeader>
      <CardContent className="py-0 px-[6px] my-[70px]">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockDREData} margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 20
            }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} />
              <YAxis tickFormatter={value => `R$${value / 1000}k`} tickLine={false} axisLine={false} />
              <Tooltip formatter={value => [formatCurrency(Number(value)), ""]} contentStyle={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} />
              <Legend />
              <Bar dataKey="receita" name="Receita" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="custos" name="Custos" fill="#f87171" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lucro" name="Lucro" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="text-xs text-muted-foreground">
          Exibindo os últimos 6 períodos
        </div>
      </CardFooter>
    </Card>
  );
};

export default DREChart;
