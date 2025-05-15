
import React, { Suspense, lazy, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockSalesData, mockFunnelData, mockTodayActivities } from "@/data/mockData";
import { ChartSkeleton } from "@/components/dashboard/DashboardSkeletons";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

// Lazy load heavy components
const StatsSection = lazy(() => import("@/components/dashboard/StatsSection"));
const SalesChart = lazy(() => import("@/components/dashboard/SalesChart"));
const FinanceChart = lazy(() => import("@/components/dashboard/FinanceChart"));
const ActivitiesSection = lazy(() => import("@/components/dashboard/ActivitiesSection"));
const IntegratedFunnel = lazy(() => import("@/components/dashboard/IntegratedFunnel"));
const DREChart = lazy(() => import("@/components/dashboard/DREChart")); // Novo componente DRE

const Dashboard = () => {
  const { profile } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // New state for filtered sales data
  const [filteredSalesData, setFilteredSalesData] = useState([]);
  const [filterPeriod, setFilterPeriod] = useState("6"); // Default to 6 months
  const [filterCollaborator, setFilterCollaborator] = useState("all");
  const [filterProduct, setFilterProduct] = useState("all");
  
  const userName = profile?.name || "usuário";
  
  useEffect(() => {
    // Simulate data loading time
    const timer = setTimeout(() => {
      setIsLoaded(true);
      
      // Initialize with all data
      setFilteredSalesData(mockSalesData);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter sales data based on selected period, collaborator and product
  useEffect(() => {
    if (!isLoaded) return;
    
    // Filter by time period
    let filteredByDate = [...mockSalesData];
    
    // Apply period filter based on exact count of months
    if (filterPeriod === "3" || filterPeriod === "6" || filterPeriod === "12") {
      const monthsToShow = parseInt(filterPeriod);
      filteredByDate = mockSalesData.slice(-monthsToShow); // Take only the last N months
    }
    
    // Apply collaborator filter if not "all"
    let filteredByCollab = filteredByDate;
    if (filterCollaborator !== "all") {
      // In a real implementation, this would filter by collaborator ID
      // For mock data, we'll just filter even/odd entries as an example
      filteredByCollab = filteredByDate.filter((_, index) => 
        filterCollaborator === "user1" ? index % 2 === 0 : index % 2 === 1
      );
    }
    
    // Apply product filter if not "all"
    let finalFiltered = filteredByCollab;
    if (filterProduct !== "all") {
      // In a real implementation, this would filter by product ID
      // For mock data, we'll just filter by value range as an example
      finalFiltered = filteredByCollab.filter(item => 
        filterProduct === "product1" ? item.value < 50000 : item.value >= 50000
      );
    }
    
    setFilteredSalesData(finalFiltered.length ? finalFiltered : []);
  }, [isLoaded, filterPeriod, filterCollaborator, filterProduct]);

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

  return (
    <DashboardLayout
      welcomeSection={<WelcomeCard userName={userName} />}
      funnelSection={<></>} // Empty to remove this section
      integratedFunnelSection={
        <Suspense fallback={<ChartSkeleton />}>
          <IntegratedFunnel />
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
        <ActivitiesSection activities={isLoaded ? mockTodayActivities : []} />
      }
    />
  );
};

export default Dashboard;
