
import React from "react";

interface DashboardLayoutProps {
  welcomeSection: React.ReactNode;
  funnelSection: React.ReactNode;
  integratedFunnelSection: React.ReactNode;
  salesAndFinanceSection: React.ReactNode;
  activitiesSection: React.ReactNode;
}

// Optimized layout without Suspense for immediate rendering
const DashboardLayout = React.memo(({
  welcomeSection,
  integratedFunnelSection,
  salesAndFinanceSection,
  activitiesSection
}: DashboardLayoutProps) => {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-150 px-[5px]">
      {/* Welcome Message Card */}
      {welcomeSection}
      
      {/* First row - Integrated Funnel 100% */}
      <div className="grid grid-cols-1 gap-6">
        {integratedFunnelSection}
      </div>
      
      {/* Second row - Sales Chart 50% + Finance Chart 50% */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {salesAndFinanceSection}
      </div>
      
      {/* Third row - Activities 100% */}
      <div className="grid grid-cols-1 gap-6">
        {activitiesSection}
      </div>
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;
