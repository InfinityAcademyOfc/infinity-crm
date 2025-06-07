import React, { Suspense } from "react";
import { ChartSkeleton } from "./DashboardSkeletons";
interface DashboardLayoutProps {
  welcomeSection: React.ReactNode;
  funnelSection: React.ReactNode; // This is now empty but we'll keep it for compatibility
  integratedFunnelSection: React.ReactNode;
  salesAndFinanceSection: React.ReactNode;
  activitiesSection: React.ReactNode;
}
const DashboardLayout = ({
  welcomeSection,
  integratedFunnelSection,
  salesAndFinanceSection,
  activitiesSection
}: DashboardLayoutProps) => {
  return <div className="space-y-6 animate-fade-in px-[5px]">
      {/* Welcome Message Card */}
      {welcomeSection}
      
      {/* First row - Integrated Funnel 100% */}
      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          {integratedFunnelSection}
        </Suspense>
      </div>
      
      {/* Second row - Sales Chart 50% + Finance Chart 50% */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {salesAndFinanceSection}
      </div>
      
      {/* Third row - Activities 100% */}
      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          {activitiesSection}
        </Suspense>
      </div>
    </div>;
};
export default DashboardLayout;