
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useFinancialData } from "@/hooks/useFinancialData";
import { useMemo } from "react";

interface DREChartProps {
  transactions?: any[];
}

const DREChart = ({ transactions = [] }: DREChartProps) => {
  const { toast } = useToast();
  const { company } = useAuth();
  const { transactions: realTransactions } = useFinancialData();
  
  // Use real transactions from hook instead of props
  const dataToUse = realTransactions.length > 0 ? realTransactions : transactions;
  
  // Calculate DRE data from real transactions
  const dreData = useMemo(() => {
    if (!dataToUse.length) return [];
    
    // Group by month
    const monthlyData: { [key: string]: { receita: number; custos: number; lucro: number } } = {};
    
    dataToUse.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { receita: 0, custos: 0, lucro: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].receita += Number(transaction.amount);
      } else if (transaction.type === 'expense') {
        monthlyData[monthKey].custos += Number(transaction.amount);
      }
    });
    
    // Calculate profit and format for chart
    return Object.entries(monthlyData).map(([month, data]) => ({
      name: month,
      receita: data.receita,
      custos: data.custos,
      lucro: data.receita - data.custos
    })).slice(-6); // Last 6 months
  }, [dataToUse]);
  
  const handleExport = () => {
    if (dreData.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Não há transações financeiras para gerar o relatório DRE.",
        variant: "destructive"
      });
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Mês,Receita,Custos,Lucro\n";

    dreData.forEach(item => {
      csvContent += `${item.name},${item.receita},${item.custos},${item.lucro}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dre-simplificado-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída",
      description: "Os dados do DRE foram exportados com sucesso para CSV.",
      duration: 2000
    });
  };

  if (!company) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Faça login para visualizar o DRE</p>
        </CardContent>
      </Card>
    );
  }

  if (dreData.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">DRE Simplificado</CardTitle>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExport} disabled>
              <Download size={16} />
              Exportar
            </Button>
          </div>
          <CardDescription>Demonstração de Resultados do Exercício</CardDescription>
        </CardHeader>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <p>Nenhuma transação financeira encontrada.</p>
            <p className="text-sm mt-2">Adicione transações no módulo Financeiro para visualizar o DRE.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            <BarChart data={dreData} margin={{
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
          Exibindo os últimos {dreData.length} períodos com dados reais
        </div>
      </CardFooter>
    </Card>
  );
};

export default DREChart;
