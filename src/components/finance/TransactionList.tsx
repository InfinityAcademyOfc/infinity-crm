
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockTransactions } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

const TransactionList = () => {
  const [transactions] = useState(mockTransactions);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Data</TableHead>
            <TableHead className="w-[250px]">Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-center">Tipo</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {formatDate(transaction.date)}
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell>{transaction.client || "-"}</TableCell>
              <TableCell className="text-right">{formatCurrency(transaction.amount)}</TableCell>
              <TableCell className="text-center">
                <Badge className={transaction.type === 'income' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }>
                  {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={
                  transaction.status === 'completed' 
                    ? 'border-green-500 text-green-700 dark:text-green-400'
                    : 'border-yellow-500 text-yellow-700 dark:text-yellow-400'
                }>
                  {transaction.status === 'completed' ? 'Concluído' : 'Pendente'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionList;
