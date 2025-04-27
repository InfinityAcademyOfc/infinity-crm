
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTransactions } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FinanceReportsProps {
  transactions?: any[];
}

const FinanceReports = ({ transactions = mockTransactions }: FinanceReportsProps) => {
  // Process data for charts
  const processMonthlyData = () => {
    const monthlyData: Record<string, { income: number; expense: number }> = {};
    
    // Initialize all months
    const months = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];
    
    months.forEach((month, index) => {
      monthlyData[month] = { income: 0, expense: 0 };
    });
    
    // Sum up transactions by month
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const month = months[date.getMonth()];
      
      if (transaction.type === "income") {
        monthlyData[month].income += transaction.amount;
      } else {
        monthlyData[month].expense += transaction.amount;
      }
    });
    
    // Convert to array for Recharts
    return Object.keys(monthlyData).map(month => ({
      name: month,
      income: monthlyData[month].income,
      expense: monthlyData[month].expense
    }));
  };
  
  const processCategoryData = () => {
    const categoryData: Record<string, number> = {};
    
    transactions.forEach(transaction => {
      if (!categoryData[transaction.category]) {
        categoryData[transaction.category] = 0;
      }
      
      if (transaction.type === "expense") {
        categoryData[transaction.category] += transaction.amount;
      }
    });
    
    // Convert to array for Recharts
    return Object.keys(categoryData).map(category => ({
      name: category,
      value: categoryData[category]
    }));
  };
  
  // Chart data
  const monthlyData = processMonthlyData();
  const categoryData = processCategoryData();
  
  // Calculate total income and expenses
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpenses;
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Receita Total</CardDescription>
            <CardTitle className="text-green-600 dark:text-green-400">
              {formatCurrency(totalIncome)}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Despesas Totais</CardDescription>
            <CardTitle className="text-red-600 dark:text-red-400">
              {formatCurrency(totalExpenses)}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Saldo</CardDescription>
            <CardTitle className={balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
              {formatCurrency(balance)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      <Tabs defaultValue="monthly">
        <TabsList>
          <TabsTrigger value="monthly">Mensal</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Receitas e Despesas Mensais</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `Mês: ${label}`}
                  />
                  <Bar dataKey="income" name="Receita" fill="#22c55e" />
                  <Bar dataKey="expense" name="Despesa" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `Categoria: ${label}`}
                  />
                  <Bar dataKey="value" name="Valor" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceReports;
