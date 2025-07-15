
import React from "react";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import MetricsWidgets from "@/components/dashboard/MetricsWidgets";
import IntegratedFunnel from "@/components/dashboard/IntegratedFunnel";
import SalesChart from "@/components/dashboard/SalesChart";
import DREChart from "@/components/dashboard/DREChart";
import ActivitiesSection from "@/components/dashboard/ActivitiesSection";
import { useDashboardData } from "@/hooks/useDashboardData";
import { mockTodayActivities } from "@/data/mockData";

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
        <IntegratedFunnel />
      </div>
      
      {/* Second row - Sales Chart 50% + DRE Chart 50% */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart 
          data={isLoaded ? filteredSalesData : []} 
          onPeriodChange={handlePeriodChange}
          onCollaboratorChange={handleCollaboratorChange}
          onProductChange={handleProductChange}
          filterPeriod={filterPeriod}
          filterCollaborator={filterCollaborator}
          filterProduct={filterProduct}
        />
        <DREChart />
      </div>
      
      {/* Third row - Activities 100% */}
      <div className="grid grid-cols-1 gap-6">
        <ActivitiesSection activities={isLoaded ? mockTodayActivities : []} />
      </div>
    </div>
  );
};

export default Dashboard;
