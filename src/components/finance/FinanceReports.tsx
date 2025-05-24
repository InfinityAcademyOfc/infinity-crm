
import { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Download, Calendar as CalendarIcon, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/lib/formatters";

interface Transaction {
  id: string;
  description: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  category: string;
  status: string;
}

interface FinanceReportsProps {
  transactions: Transaction[];
}

const FinanceReports = ({ transactions = [] }: FinanceReportsProps) => {
  const { toast } = useToast();
  
  // Filter states
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setDate(1)) // First day of current month
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [transactionType, setTransactionType] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    transactions.forEach(transaction => {
      if (transaction.category) {
        uniqueCategories.add(transaction.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [transactions]);
  
  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const matchesDateRange = 
        (!startDate || transactionDate >= startDate) && 
        (!endDate || transactionDate <= endDate);
        
      const matchesType = 
        transactionType === "all" || transaction.type === transactionType;
        
      const matchesCategory =
        category === "all" || transaction.category === category;
        
      const matchesStatus =
        status === "all" || transaction.status === status;
        
      const matchesSearch =
        !searchQuery ||
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
        
      return matchesDateRange && matchesType && matchesCategory && matchesStatus && matchesSearch;
    });
  }, [transactions, startDate, endDate, transactionType, category, status, searchQuery]);
  
  // Calculate totals
  const totals = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpense = filteredTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense
    };
  }, [filteredTransactions]);
  
  // Handle export
  const handleExport = () => {
    const exportData = {
      reportType: "Financial Transactions",
      filters: {
        dateRange: {
          start: startDate ? format(startDate, "yyyy-MM-dd") : null,
          end: endDate ? format(endDate, "yyyy-MM-dd") : null,
        },
        transactionType,
        category,
        status,
        searchQuery: searchQuery || null,
      },
      summary: {
        totalTransactions: filteredTransactions.length,
        totalIncome: totals.income,
        totalExpense: totals.expense,
        balance: totals.balance,
      },
      transactions: filteredTransactions.map(t => ({
        id: t.id,
        description: t.description,
        type: t.type,
        amount: t.amount,
        amountFormatted: formatCurrency(t.amount),
        date: t.date,
        dateFormatted: formatDate(t.date),
        category: t.category,
        status: t.status,
      })),
      exportDate: new Date().toISOString(),
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exportação concluída",
      description: "O relatório financeiro foi exportado com sucesso.",
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Relatório Financeiro</CardTitle>
        <CardDescription>Análise detalhada de receitas e despesas</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Filter controls */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date range */}
            <div className="space-y-2">
              <Label>Data inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Data final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Transaction type */}
            <div className="space-y-2">
              <Label>Tipo de transação</Label>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="income">Receitas</SelectItem>
                  <SelectItem value="expense">Despesas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Category */}
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Search */}
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Input 
                  placeholder="Buscar por descrição..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Filter className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-green-600">Total de receitas</div>
              <div className="text-2xl font-bold mt-1">{formatCurrency(totals.income)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-red-600">Total de despesas</div>
              <div className="text-2xl font-bold mt-1">{formatCurrency(totals.expense)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium">Saldo</div>
              <div className={`text-2xl font-bold mt-1 ${totals.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(totals.balance)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Transactions table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Não foram encontradas transações com os filtros selecionados.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.category || "-"}</TableCell>
                    <TableCell className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>{transaction.status === 'completed' ? 'Concluída' : 'Pendente'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredTransactions.length} {filteredTransactions.length === 1 ? "transação encontrada" : "transações encontradas"}
        </div>
        <Button 
          className="flex items-center gap-2" 
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          Exportar relatório
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FinanceReports;
