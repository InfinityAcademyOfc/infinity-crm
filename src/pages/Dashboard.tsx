import React, { Suspense, lazy } from "react";
import { ArrowRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { mockSalesData, mockFunnelData, mockTodayActivities } from "@/data/mockData";

// Lazy load heavy components
const StatsSection = lazy(() => import("@/components/dashboard/StatsSection"));
const SalesChart = lazy(() => import("@/components/dashboard/SalesChart"));
const FunnelChart = lazy(() => import("@/components/dashboard/FunnelChart"));
const FinanceChart = lazy(() => import("@/components/dashboard/FinanceChart"));
const ActivitiesSection = lazy(() => import("@/components/dashboard/ActivitiesSection"));
const IntegratedFunnel = lazy(() => import("@/components/dashboard/IntegratedFunnel"));

// Skeleton loaders for lazy loaded components
const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i} className="relative overflow-hidden">
        <CardContent className="p-6">
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const ChartSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <Skeleton className="h-6 w-1/4 mb-2" />
      <Skeleton className="h-4 w-1/3 mb-6" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </CardContent>
  </Card>
);

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
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Message Card */}
      <Card className="bg-gradient-to-r from-primary/20 to-blue-600/20 border-none shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center">
          <div className="animate-slide-in">
            <h2 className="text-2xl font-semibold mb-2">
              Olá {userName}, bem vindo!
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Com a Infinity CRM você gerencia todos seus trabalhos com praticidade de forma inteligente!
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            size="sm"
          >
            News <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
      
      {/* First row - Funnel Chart 100% width */}
      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <FunnelChart data={isLoaded ? mockFunnelData : []} />
        </Suspense>
      </div>

      {/* Second row - Integrated Funnel 100% */}
      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <IntegratedFunnel />
        </Suspense>
      </div>
      
      {/* Third row - Sales Chart 50% + Finance Chart 50% */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <SalesChart data={isLoaded ? mockSalesData : []} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <FinanceChart />
        </Suspense>
      </div>
      
      {/* Fourth row - Activities 100% */}
      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <ActivitiesSection activities={isLoaded ? mockTodayActivities : []} />
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
