
import React from 'react';
import DashboardStats from './DashboardStats';
import RecentActivities from './RecentActivities';
import FinancialChart from './FinancialChart';

export default function FunctionalDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu negócio em tempo real
        </p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FinancialChart />
        <RecentActivities />
      </div>
    </div>
  );
}
