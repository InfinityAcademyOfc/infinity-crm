
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ArrowDownRight, ArrowUpRight, PieChart, Download } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/formatters";
import { useToast } from "@/hooks/use-toast";

// Sample financial data - full 12 months
const completeFinancialData = [
  { month: "Jan", receitas: 95000, despesas: 78000, lucro: 17000 },
  { month: "Fev", receitas: 88000, despesas: 72000, lucro: 16000 },
  { month: "Mar", receitas: 92000, despesas: 75000, lucro: 17000 },
  { month: "Abr", receitas: 99000, despesas: 79000, lucro: 20000 },
  { month: "Mai", receitas: 103000, despesas: 82000, lucro: 21000 },
  { month: "Jun", receitas: 85000, despesas: 71000, lucro: 14000 },
  { month: "Jul", receitas: 91000, despesas: 76000, lucro: 15000 },
  { month: "Ago", receitas: 88000, despesas: 73000, lucro: 15000 },
  { month: "Set", receitas: 94000, despesas: 77000, lucro: 17000 },
  { month: "Out", receitas: 98000, despesas: 81000, lucro: 17000 },
  { month: "Nov", receitas: 105000, despesas: 84000, lucro: 21000 },
  { month: "Dez", receitas: 110000, despesas: 89000, lucro: 21000 },
];

const FinanceChart = () => {
  const [period, setPeriod] = useState("6m");
  const [view, setView] = useState("receitas");
  const { toast } = useToast();
  
  // Get financial data based on period
  const financialData = (() => {
    if (period === "3m") {
      return completeFinancialData.slice(-3);
    } else if (period === "6m") {
      return completeFinancialData.slice(-6);
    } else {
      return completeFinancialData;
    }
  })();
  
  // Calculate totals
  const totalReceitas = financialData.reduce((acc, item) => acc + item.receitas, 0);
  const totalDespesas = financialData.reduce((acc, item) => acc + item.despesas, 0);
  const totalLucro = financialData.reduce((acc, item) => acc + item.lucro, 0);
  const lastMonthLucro = financialData[financialData.length - 1].lucro;
  const prevMonthLucro = financialData[financialData.length - 2]?.lucro || 0;
  const lucroTrend = prevMonthLucro ? ((lastMonthLucro - prevMonthLucro) / prevMonthLucro) * 100 : 0;
  
  const handleExportDRE = () => {
    // Create export data based on the current view and period
    let exportData = {
      tipo: view === "receitas" ? "Receitas" : view === "despesas" ? "Despesas" : "Lucro",
      periodo: period === "3m" ? "Últimos 3 Meses" : period === "6m" ? "Últimos 6 Meses" : "Últimos 12 Meses",
      dados: financialData.map(item => ({
        mes: item.month,
        valor: item[view as keyof typeof item]
      })),
      total: view === "receitas" ? totalReceitas : view === "despesas" ? totalDespesas : totalLucro,
      dataExportacao: new Date().toISOString()
    };
    
    // Create and download JSON file
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dre-${view}-${period}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: `Exportação concluída`,
      description: `Os dados de ${view === "receitas" ? "Receitas" : view === "despesas" ? "Despesas" : "Lucro"} foram exportados com sucesso.`,
    });
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">DRE Simplificado</CardTitle>
            <CardDescription>Demonstrativo de resultados</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-sm">
              {lucroTrend >= 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={lucroTrend >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(lucroTrend).toFixed(1)}%
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 hidden md:flex"
              onClick={handleExportDRE}
            >
              <Download size={16} />
              Exportar
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-2">
          <Tabs defaultValue="receitas" className="w-full" onValueChange={setView}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="receitas" className="text-xs">Receitas</TabsTrigger>
              <TabsTrigger value="despesas" className="text-xs">Despesas</TabsTrigger>
              <TabsTrigger value="lucro" className="text-xs">Lucro</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-1 sm:ml-4">
            <Button 
              variant={period === "3m" ? "default" : "outline"} 
              size="sm" 
              className="h-7 text-xs px-2"
              onClick={() => setPeriod("3m")}
            >
              3M
            </Button>
            <Button 
              variant={period === "6m" ? "default" : "outline"} 
              size="sm" 
              className="h-7 text-xs px-2"
              onClick={() => setPeriod("6m")}
            >
              6M
            </Button>
            <Button 
              variant={period === "12m" ? "default" : "outline"} 
              size="sm" 
              className="h-7 text-xs px-2"
              onClick={() => setPeriod("12m")}
            >
              12M
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-2 sm:p-3 rounded-lg">
            <p className="text-xs text-green-700 dark:text-green-400">Receitas</p>
            <p className="text-sm sm:text-lg font-bold">{formatCurrency(totalReceitas)}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-2 sm:p-3 rounded-lg">
            <p className="text-xs text-red-700 dark:text-red-400">Despesas</p>
            <p className="text-sm sm:text-lg font-bold">{formatCurrency(totalDespesas)}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-3 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-400">Lucro</p>
            <p className="text-sm sm:text-lg font-bold">{formatCurrency(totalLucro)}</p>
          </div>
        </div>

        <div className="h-40 sm:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} />
              <YAxis tickFormatter={(value) => `R$${value/1000}k`} tickLine={false} axisLine={false} />
              <Tooltip 
                formatter={(value) => [formatCurrency(Number(value)), 
                  view === "receitas" ? "Receitas" : 
                  view === "despesas" ? "Despesas" : "Lucro"]}
                contentStyle={{ 
                  background: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '6px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }}
              />
              <Legend />
              {view === "receitas" && (
                <Bar dataKey="receitas" name="Receitas" fill="#22c55e" radius={[4, 4, 0, 0]} />
              )}
              {view === "despesas" && (
                <Bar dataKey="despesas" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
              )}
              {view === "lucro" && (
                <Bar dataKey="lucro" name="Lucro" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceChart;
