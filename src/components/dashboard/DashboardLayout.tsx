
import React, { Suspense } from "react";
import { ChartSkeleton } from "./DashboardSkeletons";

interface DashboardLayoutProps {
  welcomeSection: React.ReactNode;
  funnelSection: React.ReactNode;
  integratedFunnelSection: React.ReactNode;
  salesAndFinanceSection: React.ReactNode;
  activitiesSection: React.ReactNode;
}

const DashboardLayout = ({
  welcomeSection,
  funnelSection,
  integratedFunnelSection,
  salesAndFinanceSection,
  activitiesSection,
}: DashboardLayoutProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Message Card */}
      {welcomeSection}
      
      {/* First row - Funnel Chart 100% width */}
      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          {funnelSection}
        </Suspense>
      </div>

      {/* Second row - Integrated Funnel 100% */}
      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          {integratedFunnelSection}
        </Suspense>
      </div>
      
      {/* Third row - Sales Chart 50% + Finance Chart 50% */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {salesAndFinanceSection}
      </div>
      
      {/* Fourth row - Activities 100% */}
      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          {activitiesSection}
        </Suspense>
      </div>
    </div>
  );
};

export default DashboardLayout;
