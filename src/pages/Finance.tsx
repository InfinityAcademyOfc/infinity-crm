
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TransactionList from "@/components/finance/TransactionList";
import FinanceReports from "@/components/finance/FinanceReports";
import NewTransactionDialog from "@/components/finance/NewTransactionDialog";

const Finance = () => {
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("transactions");

  return (
    <div className="container space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="h-9">
              <TabsTrigger value="transactions" className="text-sm px-3">
                Lançamentos
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Button 
          onClick={() => setIsNewTransactionOpen(true)} 
          size="sm" 
          className="h-9"
        >
          <Plus className="mr-1 h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      <TabsContent value="transactions" className="mt-0">
        <TransactionList />
      </TabsContent>

      <TabsContent value="reports" className="mt-0">
        <FinanceReports />
      </TabsContent>

      <NewTransactionDialog
        open={isNewTransactionOpen}
        onOpenChange={setIsNewTransactionOpen}
      />
    </div>
  );
};

export default Finance;
