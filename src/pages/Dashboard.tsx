
import React, { Suspense, lazy } from "react";
import { ChartSkeleton } from "@/components/dashboard/DashboardSkeletons";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import MetricsWidgets from "@/components/dashboard/MetricsWidgets";
import { useDashboardData } from "@/hooks/useDashboardData";
import { mockTodayActivities } from "@/data/mockData";

// Lazy load heavy components
const IntegratedFunnel = lazy(() => import("@/components/dashboard/IntegratedFunnel"));
const SalesChart = lazy(() => import("@/components/dashboard/SalesChart"));
const DREChart = lazy(() => import("@/components/dashboard/DREChart"));
const ActivitiesSection = lazy(() => import("@/components/dashboard/ActivitiesSection"));

const Dashboard = () => {
  const {
    userName,
    isLoaded,
    filteredSalesData,
    filterPeriod,
    filterCollaborator,
    filterProduct,
    handlePeriodChange,
    handleCollaboratorChange,
    handleProductChange
  } = useDashboardData();

  return (
    <div className="space-y-6 animate-fade-in px-[5px]">
      {/* Welcome Message Card */}
      <WelcomeCard userName={userName} />
      
      {/* Real-time Metrics Widgets */}
      <MetricsWidgets />
      
      {/* First row - Integrated Funnel 100% */}
      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <IntegratedFunnel />
        </Suspense>
      </div>
      
      {/* Second row - Sales Chart 50% + DRE Chart 50% */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </div>
      
      {/* Third row - Activities 100% */}
      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <ActivitiesSection activities={isLoaded ? mockTodayActivities : []} />
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
