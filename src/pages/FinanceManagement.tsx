import { useState } from "react";
import { Plus, ArrowUp, ArrowDown, Calendar, DollarSign, MoreHorizontal, Tag, FileText, Trash2, Filter } from "lucide-react";
import { SectionHeader, ActionButton } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { mockTransactions } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/lib/formatters";
import FinanceReports from "@/components/finance/FinanceReports";
import { Transaction, TransactionType } from "@/types/finance";
const FinanceManagement = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions as Transaction[]);
  const [newTransactionOpen, setNewTransactionOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>("income");
  const [activeTab, setActiveTab] = useState("transactions");
  const {
    toast
  } = useToast();
  const incomes = transactions.filter(t => t.type === "income");
  const expenses = transactions.filter(t => t.type === "expense");
  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const description = formData.get("description") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const category = formData.get("category") as string;
    const date = formData.get("date") as string;
    const client = formData.get("client") as string;
    const notes = formData.get("notes") as string;
    if (!description || isNaN(amount) || !category || !date) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    const newTransaction: Transaction = {
      id: (transactions.length + 1).toString(),
      type: transactionType,
      description,
      amount,
      date,
      category,
      client: client || null,
      status: "completed",
      notes: notes || ""
    };
    setTransactions([newTransaction, ...transactions]);
    setNewTransactionOpen(false);
    form.reset();
    toast({
      title: `${transactionType === "income" ? "Receita" : "Despesa"} adicionada`,
      description: `${description} foi adicionada com sucesso`
    });
  };
  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast({
      title: "Transação removida",
      description: "A transação foi removida com sucesso"
    });
  };

  // Function to handle exit confirmation for dialog
  const [confirmExitOpen, setConfirmExitOpen] = useState(false);
  const handleDialogClose = () => {
    setConfirmExitOpen(true);
  };
  const confirmExit = () => {
    setConfirmExitOpen(false);
    setNewTransactionOpen(false);
  };
  return <div className="space-y-6">
      <SectionHeader title="Financeiro" description="Gestão de receitas e despesas" actions={<>
            <ActionButton icon={<FileText size={16} />} label="Relatórios" onClick={() => {
        setActiveTab("reports");
      }} variant={activeTab === "reports" ? "default" : "outline"} />
            <ActionButton icon={<Plus size={16} />} label="Nova Transação" onClick={() => {
        setTransactionType("income");
        setNewTransactionOpen(true);
      }} />
          </>} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 mx-0 my-0 px-[2px] py-0">
          <TabsTrigger value="transactions">Lançamentos</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-6">
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
                      {transactions.map(transaction => <TableRow key={transaction.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                                {transaction.type === "income" ? <ArrowUp size={16} className="text-green-600" /> : <ArrowDown size={16} className="text-red-600" />}
                              </div>
                              <div>
                                <div className="font-medium">{transaction.description}</div>
                                <div className="md:hidden text-xs text-muted-foreground">
                                  {formatDate(transaction.date)}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(transaction.date)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline" className="bg-gray-100">
                              {transaction.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {transaction.client || "-"}
                          </TableCell>
                          <TableCell className={transaction.type === "income" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
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
                                <DropdownMenuItem className="text-red-600 focus:text-red-600 gap-2 cursor-pointer" onClick={() => handleDeleteTransaction(transaction.id)}>
                                  <Trash2 size={14} />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>)}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <Button variant="outline">Carregar Mais</Button>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <FinanceReports transactions={transactions} />
        </TabsContent>
      </Tabs>
      
      {/* Dialog for adding new transaction */}
      <Dialog open={newTransactionOpen} onOpenChange={open => {
      if (!open) {
        handleDialogClose();
      } else {
        setNewTransactionOpen(true);
      }
    }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Transação</DialogTitle>
            <DialogDescription>
              Adicione uma nova receita ou despesa ao sistema.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={transactionType} onValueChange={v => setTransactionType(v as "income" | "expense")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="income" className="gap-2">
                <ArrowUp size={16} className="text-green-600" />
                Receita
              </TabsTrigger>
              <TabsTrigger value="expense" className="gap-2">
                <ArrowDown size={16} className="text-red-600" />
                Despesa
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleAddTransaction} className="mt-4 space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição*</Label>
                  <Input id="description" name="description" placeholder={`Ex: ${transactionType === "income" ? "Pagamento de Cliente" : "Aluguel"}`} required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Valor (R$)*</Label>
                    <Input id="amount" name="amount" type="number" min="0" step="0.01" placeholder="0,00" required />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="date">Data*</Label>
                    <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoria*</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {transactionType === "income" ? <>
                            <SelectItem value="Vendas">Vendas</SelectItem>
                            <SelectItem value="Serviços">Serviços</SelectItem>
                            <SelectItem value="Consultoria">Consultoria</SelectItem>
                            <SelectItem value="Recorrente">Recorrente</SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </> : <>
                            <SelectItem value="Pessoal">Pessoal</SelectItem>
                            <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Software">Software</SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </>}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {transactionType === "income" && <div className="grid gap-2">
                      <Label htmlFor="client">Cliente</Label>
                      <Select name="client">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Empresa ABC Ltda.">Empresa ABC Ltda.</SelectItem>
                          <SelectItem value="Consultoria XYZ">Consultoria XYZ</SelectItem>
                          <SelectItem value="Distribuidora Central">Distribuidora Central</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea id="notes" name="notes" placeholder="Informações adicionais sobre a transação..." rows={3} />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {transactionType === "income" ? "Adicionar Receita" : "Adicionar Despesa"}
                </Button>
              </DialogFooter>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation dialog for exiting transaction form */}
      <Dialog open={confirmExitOpen} onOpenChange={setConfirmExitOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tem certeza que deseja sair?</DialogTitle>
            <DialogDescription>
              Se sair agora, todas as informações não salvas serão perdidas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setConfirmExitOpen(false)}>
              Não, continuar editando
            </Button>
            <Button type="button" variant="destructive" onClick={confirmExit}>
              Sim, sair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};
export default FinanceManagement;