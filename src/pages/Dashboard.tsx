
import React, { Suspense, lazy, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ChartSkeleton } from "@/components/dashboard/DashboardSkeletons";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { updateDashboardData, useModuleSync } from "@/services/moduleSyncService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Lazy load heavy components
const StatsSection = lazy(() => import("@/components/dashboard/StatsSection"));
const SalesChart = lazy(() => import("@/components/dashboard/SalesChart"));
const FinanceChart = lazy(() => import("@/components/dashboard/FinanceChart"));
const ActivitiesSection = lazy(() => import("@/components/dashboard/ActivitiesSection"));
const IntegratedFunnel = lazy(() => import("@/components/dashboard/IntegratedFunnel"));
const DREChart = lazy(() => import("@/components/dashboard/DREChart"));

const Dashboard = () => {
  const { profile, company } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Module sync state
  const { leads, clients, tasks, products, syncAllModules } = useModuleSync();
  
  // State for filtered sales data
  const [filteredSalesData, setFilteredSalesData] = useState<any[]>([]);
  const [filterPeriod, setFilterPeriod] = useState("6"); // Default to 6 months
  const [filterCollaborator, setFilterCollaborator] = useState("all");
  const [filterProduct, setFilterProduct] = useState("all");
  
  // Activity data
  const [activities, setActivities] = useState<any[]>([]);
  
  // Get user display name
  const userName = profile?.name || company?.name || "usuário";
  
  // Efeito para carregar dados do Supabase quando o usuário está autenticado
  useEffect(() => {
    if (!company?.id) return;
    
    // Função para buscar dados do Supabase
    const fetchData = async () => {
      try {
        // Use updateDashboardData to fetch all data from Supabase
        await updateDashboardData(company.id);
        
        // Get the latest state
        const { leads: currentLeads, tasks: currentTasks } = useModuleSync.getState();
        
        // Converter leads para formato de vendas para o gráfico
        const leadSalesData = currentLeads.map((lead) => ({
          name: new Date(lead.created_at).toLocaleDateString('pt-BR', { month: 'short' }),
          value: lead.value || 0,
          leads: 1
        }));
        
        // Agrupar por mês
        const groupedByMonth = leadSalesData.reduce((acc: any, curr: any) => {
          const month = curr.name;
          if (!acc[month]) {
            acc[month] = { name: month, value: 0, leads: 0 };
          }
          acc[month].value += curr.value;
          acc[month].leads += curr.leads;
          return acc;
        }, {});
        
        // Converter de volta para array e ordenar por mês
        const salesData = Object.values(groupedByMonth);
        
        // Preparar atividades para o dashboard
        const activityData = currentTasks.map(task => ({
          id: task.id,
          type: 'task',
          title: task.title,
          time: new Date(task.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          relatedTo: task.client || 'Interno',
          status: task.status,
          priority: task.priority || 'medium'
        })).slice(0, 5);
        
        setActivities(activityData);
        setFilteredSalesData(salesData.length > 0 ? salesData : []);
        setIsLoaded(true);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados do dashboard");
        setIsLoaded(true);
      }
    };
    
    fetchData();
  }, [company]);
  
  // Filter sales data based on selected period, collaborator and product
  useEffect(() => {
    if (!isLoaded || filteredSalesData.length === 0) return;
    
    // Filter by time period
    let filteredByDate = [...filteredSalesData];
    
    // Apply period filter based on exact count of months
    if (filterPeriod === "3" || filterPeriod === "6" || filterPeriod === "12") {
      const monthsToShow = parseInt(filterPeriod);
      filteredByDate = filteredSalesData.slice(-monthsToShow); // Take only the last N months
    }
    
    // Apply collaborator filter if not "all"
    let filteredByCollab = filteredByDate;
    if (filterCollaborator !== "all") {
      // In a real implementation, this would filter by collaborator ID
      // For now, we'll filter based on what data we have
      filteredByCollab = filteredByDate.filter((item) => {
        const lead = leads.find(lead => lead.assigned_to === filterCollaborator);
        return lead ? true : false;
      });
    }
    
    // Apply product filter if not "all"
    let finalFiltered = filteredByCollab;
    if (filterProduct !== "all") {
      // Filter by product would require more detailed data
      finalFiltered = filteredByCollab;
    }
    
    setFilteredSalesData(finalFiltered);
  }, [filterPeriod, filterCollaborator, filterProduct, isLoaded, leads]);

  // Filter handlers for SalesChart
  const handlePeriodChange = (period: string) => {
    setFilterPeriod(period);
  };
  
  const handleCollaboratorChange = (collaborator: string) => {
    setFilterCollaborator(collaborator);
  };
  
  const handleProductChange = (product: string) => {
    setFilterProduct(product);
  };
  
  // Atualizar dados via Realtime Subscription
  useEffect(() => {
    if (!company?.id) return;
    
    // Inscrever para atualizações de leads em tempo real
    const leadsChannel = supabase
      .channel('leads-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'leads', filter: `company_id=eq.${company.id}` }, 
        payload => {
          console.log("Alteração em leads detectada:", payload);
          // Recarregar dados
          updateDashboardData(company.id);
        }
      )
      .subscribe();
      
    // Inscrever para atualizações de clients em tempo real
    const clientsChannel = supabase
      .channel('clients-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'clients', filter: `company_id=eq.${company.id}` }, 
        payload => {
          console.log("Alteração em clientes detectada:", payload);
          // Recarregar dados
          updateDashboardData(company.id);
        }
      )
      .subscribe();
      
    // Inscrever para atualizações de tasks em tempo real
    const tasksChannel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks', filter: `company_id=eq.${company.id}` }, 
        payload => {
          console.log("Alteração em tarefas detectada:", payload);
          // Recarregar dados
          updateDashboardData(company.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(clientsChannel);
      supabase.removeChannel(tasksChannel);
    };
  }, [company]);

  return (
    <DashboardLayout
      welcomeSection={<WelcomeCard userName={userName} />}
      funnelSection={<></>} // Empty to remove this section
      integratedFunnelSection={
        <Suspense fallback={<ChartSkeleton />}>
          <IntegratedFunnel leadData={leads} />
        </Suspense>
      }
      salesAndFinanceSection={
        <>
          <Suspense fallback={<ChartSkeleton />}>
            <SalesChart 
              data={isLoaded ? filteredSalesData : []} 
              onPeriodChange={handlePeriodChange}
              onCollaboratorChange={handleCollaboratorChange}
              onProductChange={handleProductChange}
              filterPeriod={filterPeriod}
              filterCollaborator={filterCollaborator}
              filterProduct={filterProduct}
            />
          </Suspense>
          <Suspense fallback={<ChartSkeleton />}>
            <DREChart />
          </Suspense>
        </>
      }
      activitiesSection={
        <ActivitiesSection activities={activities} />
      }
    />
  );
};

export default Dashboard;
