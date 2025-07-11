import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updateDashboardData, useModuleSync } from "@/services/moduleSyncService";
import { supabase } from "@/integrations/supabase"; // Importar do index.ts
import { mockSalesData } from "@/data/mockData";

export const useDashboardData = () => {
  const { profile, company } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [rawSalesData, setRawSalesData] = useState<any[]>([]); // Dados brutos
  const [filterPeriod, setFilterPeriod] = useState("6");
  const [filterCollaborator, setFilterCollaborator] = useState("all");
  const [filterProduct, setFilterProduct] = useState("all");
  
  const { leads, clients, tasks, products, syncAllModules } = useModuleSync();
  
  const userName = profile?.name || "usuário";

  // Efeito para buscar e processar dados iniciais
  useEffect(() => {
    if (!company) return;
    
    const fetchData = async () => {
      try {
        await updateDashboardData(company.id);
        const { leads: currentLeads } = useModuleSync.getState();
        
        const leadSalesData = currentLeads.map((lead) => ({
          name: new Date(lead.created_at).toLocaleDateString("pt-BR", { month: "short" }),
          value: lead.value || 0,
          leads: 1
        }));
        
        const groupedByMonth = leadSalesData.reduce((acc: any, curr: any) => {
          const month = curr.name;
          if (!acc[month]) {
            acc[month] = { name: month, value: 0, leads: 0 };
          }
          acc[month].value += curr.value;
          acc[month].leads += curr.leads;
          return acc;
        }, {});
        
        const salesData = Object.values(groupedByMonth);
        setRawSalesData(salesData.length > 0 ? salesData : mockSalesData); // Armazena dados brutos
        setIsLoaded(true);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setRawSalesData(mockSalesData);
        setIsLoaded(true);
      }
    };
    
    fetchData();
  }, [company]);

  // Use useMemo para filtrar os dados, dependendo apenas dos filtros e dos dados brutos
  const filteredSalesData = useMemo(() => {
    let filtered = [...rawSalesData];
    
    if (filterPeriod === "3" || filterPeriod === "6" || filterPeriod === "12") {
      const monthsToShow = parseInt(filterPeriod);
      filtered = filtered.slice(-monthsToShow);
    }
    
    if (filterCollaborator !== "all") {
      filtered = filtered.filter((_, index) => 
        filterCollaborator === "user1" ? index % 2 === 0 : index % 2 === 1
      );
    }
    
    if (filterProduct !== "all") {
      filtered = filtered.filter(item => 
        filterProduct === "product1" ? item.value < 50000 : item.value >= 50000
      );
    }
    
    return filtered.length ? filtered : [];
  }, [rawSalesData, filterPeriod, filterCollaborator, filterProduct]);

  // Efeito para real-time updates do Supabase
  useEffect(() => {
    if (!company) return;
    
    const leadsChannel = supabase
      .channel("leads-changes")
      .on("postgres_changes", 
        { event: "*", schema: "public", table: "leads", filter: `company_id=eq.${company.id}` }, 
        payload => {
          console.log("Alteração em leads detectada:", payload);
          updateDashboardData(company.id); // Isso vai acionar um novo fetch e atualizar rawSalesData
        }
      )
      .subscribe();
      
    const clientsChannel = supabase
      .channel("clients-changes")
      .on("postgres_changes", 
        { event: "*", schema: "public", table: "clients", filter: `company_id=eq.${company.id}` }, 
        payload => {
          console.log("Alteração em clientes detectada:", payload);
          updateDashboardData(company.id);
        }
      )
      .subscribe();
      
    const tasksChannel = supabase
      .channel("tasks-changes")
      .on("postgres_changes", 
        { event: "*", schema: "public", table: "tasks", filter: `company_id=eq.${company.id}` }, 
        payload => {
          console.log("Alteração em tarefas detectada:", payload);
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

  // Callbacks memorizados para evitar re-renders desnecessários de componentes filhos
  const handlePeriodChange = useCallback((period: string) => {
    setFilterPeriod(period);
  }, []);
  
  const handleCollaboratorChange = useCallback((collaborator: string) => {
    setFilterCollaborator(collaborator);
  }, []);
  
  const handleProductChange = useCallback((product: string) => {
    setFilterProduct(product);
  }, []);

  return {
    userName,
    isLoaded,
    filteredSalesData,
    filterPeriod,
    filterCollaborator,
    filterProduct,
    handlePeriodChange,
    handleCollaboratorChange,
    handleProductChange
  };
};


