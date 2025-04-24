
import React from "react";
import StatsSection from "@/components/dashboard/StatsSection";
import SalesChart from "@/components/dashboard/SalesChart";
import FunnelChart from "@/components/dashboard/FunnelChart";
import FinanceChart from "@/components/dashboard/FinanceChart";
import ActivitiesSection from "@/components/dashboard/ActivitiesSection";
import IntegratedFunnel from "@/components/dashboard/IntegratedFunnel";
import { mockSalesData, mockFunnelData, mockTodayActivities } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const { profile } = useAuth();
  
  const userName = profile?.name || "usuário";

  return (
    <div className="space-y-6">
      {/* Welcome Message Card */}
      <Card className="bg-gradient-to-r from-primary/20 to-blue-600/20 border-none shadow-lg">
        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              Olá {userName}, bem vindo!
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Com a Infinity CRM você gerencia todos seus trabalhos com praticidade de forma inteligente!
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
            size="sm"
          >
            News <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
      
      <StatsSection />
      
      {/* First row - Sales Chart 60% + Integrated Funnel 40% */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <SalesChart data={mockSalesData} />
        </div>
        <div className="lg:col-span-2">
          <IntegratedFunnel />
        </div>
      </div>
      
      {/* Second row - Funnel Chart (Conversão de Funil) 100% width */}
      <div className="grid grid-cols-1 gap-6">
        <FunnelChart data={mockFunnelData} />
      </div>
      
      {/* Third row - Finance Chart (DRE Simplificado) 100% */}
      <div className="grid grid-cols-1 gap-6">
        <FinanceChart />
      </div>
      
      {/* Fourth row - Activities 100% */}
      <div className="grid grid-cols-1 gap-6">
        <ActivitiesSection activities={mockTodayActivities} />
      </div>
    </div>
  );
};

export default Dashboard;
