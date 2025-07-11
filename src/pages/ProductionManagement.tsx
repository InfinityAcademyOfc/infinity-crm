
import { useState } from "react";
import ProductionTabs from "@/components/production/ProductionTabs";
import { ProjectManagement } from "@/components/production/ProjectManagement";
import { ProductionHeader } from "@/components/production/ProductionHeader";
import { NewTaskDialog } from "@/components/production/NewTaskDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target } from "lucide-react";
import { useProductionManagement } from "@/hooks/useProductionManagement";

const ProductionManagement = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  
  const {
    columns,
    setColumns,
    loading,
    isSyncing,
    handleSyncModules,
    createNewTask
  } = useProductionManagement();

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="animate-pulse">
          <div className="h-16 bg-muted rounded mb-4"></div>
          <div className="h-12 bg-muted rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <ProductionHeader
        isSyncing={isSyncing}
        onSyncModules={handleSyncModules}
        onNewTask={() => setIsNewTaskDialogOpen(true)}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full md:w-fit mb-6">
          <TabsTrigger value="projects" className="px-4 text-xs">
            <Target className="h-4 w-4 mr-2" />
            Projetos
          </TabsTrigger>
          <TabsTrigger value="production" className="px-4 text-xs">
            Produção
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <ProjectManagement companyId="mock-company-id" />
        </TabsContent>

        <TabsContent value="production">
          <ProductionTabs columns={columns} setColumns={setColumns} />
        </TabsContent>
      </Tabs>
      
      <NewTaskDialog
        open={isNewTaskDialogOpen}
        onOpenChange={setIsNewTaskDialogOpen}
        onCreateTask={createNewTask}
      />
    </div>
  );
};

export default ProductionManagement;
