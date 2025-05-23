import React, { Suspense, lazy, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ChartSkeleton } from "@/components/dashboard/DashboardSkeletons";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useRealData } from "@/hooks/useRealData";
import { useNotifications } from "@/hooks/useNotifications";
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
  const { notifySystemEvent } = useNotifications();
  
  // Use real data hook
  const { 
    leads, 
    clients, 
    tasks, 
    products, 
    meetings,
    teamMembers,
    transactions,
    loading: dataLoading,
    refetch
  } = useRealData();
  
  // State for filtered sales data
  const [filteredSalesData, setFilteredSalesData] = useState<any[]>([]);
  const [filterPeriod, setFilterPeriod] = useState("6");
  const [filterCollaborator, setFilterCollaborator] = useState("all");
  const [filterProduct, setFilterProduct] = useState("all");
  
  // Activity data from real tasks
  const [activities, setActivities] = useState<any[]>([]);

  // Process real data when it changes
  useEffect(() => {
    if (dataLoading) return;
    
    try {
      // Convert leads to sales data for charts
      const leadSalesData = leads.map((lead) => ({
        name: new Date(lead.created_at).toLocaleDateString('pt-BR', { month: 'short' }),
        value: lead.value || 0,
        leads: 1,
        date: new Date(lead.created_at)
      }));
      
      // Group by month
      const groupedByMonth = leadSalesData.reduce((acc: any, curr: any) => {
        const month = curr.name;
        if (!acc[month]) {
          acc[month] = { name: month, value: 0, leads: 0, date: curr.date };
        }
        acc[month].value += curr.value;
        acc[month].leads += curr.leads;
        return acc;
      }, {});
      
      // Convert back to array and sort by date
      const salesData = Object.values(groupedByMonth).sort((a: any, b: any) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      // Prepare activities from real tasks
      const activityData = tasks.slice(0, 5).map(task => ({
        id: task.id,
        type: 'task',
        title: task.title,
        time: new Date(task.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        relatedTo: task.client_id ? `Cliente: ${clients.find(c => c.id === task.client_id)?.name || 'Cliente'}` : 'Interno',
        status: task.status,
        priority: task.priority || 'medium'
      }));
      
      setActivities(activityData);
      setFilteredSalesData(salesData);
      
      // Show success notification
      if (leads.length > 0 || tasks.length > 0) {
        toast.success(`Dashboard atualizado com ${leads.length} leads e ${tasks.length} tarefas`);
        
        // System notification
        notifySystemEvent(
          "Dashboard atualizado", 
          `Dashboard carregado com dados de ${leads.length} leads, ${clients.length} clientes e ${tasks.length} tarefas.`
        );
      }
    } catch (error) {
      console.error("Erro ao processar dados:", error);
      toast.error("Erro ao processar dados do dashboard");
    }
  }, [leads, clients, tasks, dataLoading, notifySystemEvent]);
  
  // Filter sales data based on selected filters
  useEffect(() => {
    if (dataLoading || !leads.length) return;
    
    // Apply filters to sales data
    let filteredLeads = [...leads];
    
    // Filter by collaborator
    if (filterCollaborator !== "all") {
      filteredLeads = filteredLeads.filter(lead => lead.assigned_to === filterCollaborator);
    }
    
    // Filter by time period
    if (filterPeriod !== "all") {
      const monthsToShow = parseInt(filterPeriod);
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsToShow);
      filteredLeads = filteredLeads.filter(lead => new Date(lead.created_at) >= cutoffDate);
    }
    
    // Convert to chart data
    const chartData = filteredLeads.map((lead) => ({
      name: new Date(lead.created_at).toLocaleDateString('pt-BR', { month: 'short' }),
      value: lead.value || 0,
      leads: 1,
      date: new Date(lead.created_at)
    }));
    
    // Group by month
    const groupedData = chartData.reduce((acc: any, curr: any) => {
      const month = curr.name;
      if (!acc[month]) {
        acc[month] = { name: month, value: 0, leads: 0, date: curr.date };
      }
      acc[month].value += curr.value;
      acc[month].leads += curr.leads;
      return acc;
    }, {});
    
    const finalData = Object.values(groupedData).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    setFilteredSalesData(finalData);
  }, [filterPeriod, filterCollaborator, filterProduct, leads, dataLoading]);

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
  
  // Manual refresh function
  const handleRefreshDashboard = async () => {
    if (!company?.id) return;
    
    toast.loading("Atualizando dados...");
    
    try {
      await refetch();
      toast.dismiss();
      toast.success("Dashboard atualizado com sucesso!");
      
      await notifySystemEvent(
        "Dashboard atualizado manualmente", 
        `Dashboard atualizado manualmente em ${new Date().toLocaleString('pt-BR')}.`
      );
    } catch (error) {
      console.error("Erro ao atualizar dashboard:", error);
      toast.dismiss();
      toast.error("Erro ao atualizar dashboard");
    }
  };

  return (
    <DashboardLayout
      welcomeSection={<WelcomeCard />}
      onRefresh={handleRefreshDashboard}
      lastUpdated={new Date().toLocaleString('pt-BR')}
      isRefreshing={dataLoading}
      funnelSection={<></>}
      integratedFunnelSection={
        <Suspense fallback={<ChartSkeleton />}>
          <IntegratedFunnel leadData={leads} />
        </Suspense>
      }
      salesAndFinanceSection={
        <>
          <Suspense fallback={<ChartSkeleton />}>
            <SalesChart 
              data={filteredSalesData} 
              onPeriodChange={handlePeriodChange}
              onCollaboratorChange={handleCollaboratorChange}
              onProductChange={handleProductChange}
              filterPeriod={filterPeriod}
              filterCollaborator={filterCollaborator}
              filterProduct={filterProduct}
            />
          </Suspense>
          <Suspense fallback={<ChartSkeleton />}>
            <DREChart transactions={transactions} />
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
