
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useFinancialData } from '@/hooks/useFinancialData';

export default function FinancialChart() {
  const { transactions } = useFinancialData();

  // Processar dados para gráfico dos últimos 6 meses
  const processChartData = () => {
    const months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getFullYear() === date.getFullYear() && 
               transactionDate.getMonth() === date.getMonth();
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
        
      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      months.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        receita: income,
        despesa: expense,
        lucro: income - expense
      });
    }
    
    return months;
  };

  const chartData = processChartData();

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Evolução Financeira - Últimos 6 Meses</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis 
              tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
            />
            <Tooltip 
              formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
              labelFormatter={(label) => `Mês: ${label}`}
            />
            <Bar dataKey="receita" fill="#10b981" name="Receita" />
            <Bar dataKey="despesa" fill="#ef4444" name="Despesa" />
            <Bar dataKey="lucro" fill="#3b82f6" name="Lucro" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
