
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface FinancialSummaryProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  totalIncome,
  totalExpense,
  balance
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Saldo Atual</CardTitle>
          <CardDescription>Total de receitas - despesas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {formatCurrency(balance)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-green-600">
            <ArrowUp className="mr-2 h-4 w-4" />
            Receitas
          </CardTitle>
          <CardDescription>Total de entradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {formatCurrency(totalIncome)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-red-600">
            <ArrowDown className="mr-2 h-4 w-4" />
            Despesas
          </CardTitle>
          <CardDescription>Total de saídas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">
            {formatCurrency(totalExpense)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
