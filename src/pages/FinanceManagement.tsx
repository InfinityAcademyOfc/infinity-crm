
import { useState } from "react";
import { Plus, FileText } from "lucide-react";
import { SectionHeader, ActionButton } from "@/components/ui/section-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionForm } from "@/components/finance/TransactionForm";
import { TransactionList } from "@/components/finance/TransactionList";
import { FinancialSummary } from "@/components/finance/FinancialSummary";
import { useFinanceTransactions } from "@/hooks/useFinanceTransactions";
import { useToast } from "@/hooks/use-toast";
import FinanceReports from "@/components/finance/FinanceReports";
import { TransactionType } from "@/types/finance";

const FinanceManagement = () => {
  const [newTransactionOpen, setNewTransactionOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>("income");
  const [activeTab, setActiveTab] = useState("transactions");
  const { toast } = useToast();
  
  const {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    getFinancialSummary
  } = useFinanceTransactions();

  const { totalIncome, totalExpense, balance } = getFinancialSummary();

  const handleAddTransaction = async (data: any) => {
    if (!data.description || isNaN(data.amount) || !data.category || !data.date) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      throw new Error("Campos obrigatórios não preenchidos");
    }

    await addTransaction(data);
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Financeiro" 
        description="Gestão de receitas e despesas" 
        actions={
          <>
            <ActionButton 
              icon={<FileText size={16} />} 
              label="Relatórios" 
              onClick={() => setActiveTab("reports")} 
              variant={activeTab === "reports" ? "default" : "outline"} 
            />
            <ActionButton 
              icon={<Plus size={16} />} 
              label="Nova Transação" 
              onClick={() => {
                setTransactionType("income");
                setNewTransactionOpen(true);
              }} 
            />
          </>
        } 
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 mx-0 my-0 px-[2px] py-0">
          <TabsTrigger value="transactions">Lançamentos</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-6">
          <FinancialSummary 
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            balance={balance}
          />
          
          <TransactionList 
            transactions={transactions}
            loading={loading}
            onDeleteTransaction={deleteTransaction}
          />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <FinanceReports transactions={transactions} />
        </TabsContent>
      </Tabs>
      
      <TransactionForm
        open={newTransactionOpen}
        onOpenChange={setNewTransactionOpen}
        onSubmit={handleAddTransaction}
        initialType={transactionType}
      />
    </div>
  );
};

export default FinanceManagement;
