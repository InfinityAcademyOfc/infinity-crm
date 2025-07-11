
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUp, ArrowDown, Calendar, Filter, MoreHorizontal, FileText, Tag, Trash2 } from "lucide-react";
import { Transaction } from "@/types/finance";
import { formatCurrency, formatDate } from "@/lib/formatters";

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  loading,
  onDeleteTransaction
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando transações...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Transações</CardTitle>
            <CardDescription>Histórico de receitas e despesas</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-9 gap-2">
              <Filter size={16} />
              Filtrar
            </Button>
            <div className="relative w-[180px]">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="date" className="pl-9" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="income">Receitas</TabsTrigger>
            <TabsTrigger value="expense">Despesas</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
          </TabsList>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                  <TableHead className="hidden md:table-cell">Categoria</TableHead>
                  <TableHead className="hidden md:table-cell">Cliente/Fornecedor</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(transaction => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-full ${
                          transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                        }`}>
                          {transaction.type === "income" ? 
                            <ArrowUp size={16} className="text-green-600" /> : 
                            <ArrowDown size={16} className="text-red-600" />
                          }
                        </div>
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="md:hidden text-xs text-muted-foreground">
                            {formatDate(transaction.date)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="bg-gray-100">
                        {transaction.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {transaction.client || "-"}
                    </TableCell>
                    <TableCell className={
                      transaction.type === "income" ? "text-green-600 font-medium" : "text-red-600 font-medium"
                    }>
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(Number(transaction.amount))}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={transaction.status === "completed" ? "default" : "outline"}>
                        {transaction.status === "completed" ? "Concluído" : "Pendente"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <FileText size={14} />
                            Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Tag size={14} />
                            Alterar Categoria
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600 gap-2 cursor-pointer" 
                            onClick={() => onDeleteTransaction(transaction.id)}
                          >
                            <Trash2 size={14} />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button variant="outline">Carregar Mais</Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
