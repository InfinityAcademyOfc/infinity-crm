
import React, { Suspense, lazy, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockSalesData, mockFunnelData, mockTodayActivities } from "@/data/mockData";
import { ChartSkeleton } from "@/components/dashboard/DashboardSkeletons";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

// Lazy load heavy components
const StatsSection = lazy(() => import("@/components/dashboard/StatsSection"));
const SalesChart = lazy(() => import("@/components/dashboard/SalesChart"));
const FunnelChart = lazy(() => import("@/components/dashboard/FunnelChart"));
const FinanceChart = lazy(() => import("@/components/dashboard/FinanceChart"));
const ActivitiesSection = lazy(() => import("@/components/dashboard/ActivitiesSection"));
const IntegratedFunnel = lazy(() => import("@/components/dashboard/IntegratedFunnel"));

const Dashboard = () => {
  const { profile } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  
  const userName = profile?.name || "usuário";
  
  useEffect(() => {
    // Simulate data loading time
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout
      welcomeSection={<WelcomeCard userName={userName} />}
      funnelSection={<FunnelChart data={isLoaded ? mockFunnelData : []} />}
      integratedFunnelSection={<IntegratedFunnel />}
      salesAndFinanceSection={
        <>
          <Suspense fallback={<ChartSkeleton />}>
            <SalesChart data={isLoaded ? mockSalesData : []} />
          </Suspense>
          <Suspense fallback={<ChartSkeleton />}>
            <FinanceChart />
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
