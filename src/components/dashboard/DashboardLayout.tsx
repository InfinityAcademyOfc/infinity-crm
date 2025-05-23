
import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardLayoutProps {
  welcomeSection?: React.ReactNode;
  funnelSection?: React.ReactNode;
  integratedFunnelSection?: React.ReactNode;
  salesAndFinanceSection?: React.ReactNode;
  activitiesSection?: React.ReactNode;
  onRefresh?: () => void;
  lastUpdated?: string;
  isRefreshing?: boolean;
}

const DashboardLayout = ({
  welcomeSection,
  funnelSection,
  integratedFunnelSection,
  salesAndFinanceSection,
  activitiesSection,
  onRefresh,
  lastUpdated,
  isRefreshing
}: DashboardLayoutProps) => {
  return (
    <div className="space-y-6 pb-8">
      {/* Cabeçalho e botão de atualização */}
      {onRefresh && (
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            {lastUpdated && (
              <p className="text-sm text-muted-foreground">
                Última atualização: {lastUpdated}
              </p>
            )}
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className={`${isRefreshing ? 'animate-spin' : ''}`}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar Dados
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Atualiza todos os dados do dashboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
      {/* Welcome Card */}
      {welcomeSection && (
        <div className="welcome-section">{welcomeSection}</div>
      )}

      {/* Funnel Section */}
      {funnelSection && (
        <div className="funnel-section">{funnelSection}</div>
      )}

      {/* Integrated Funnel */}
      {integratedFunnelSection && (
        <div className="integrated-funnel">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            {isRefreshing ? (
              <div className="p-6">
                <Skeleton className="h-40 w-full" />
              </div>
            ) : (
              integratedFunnelSection
            )}
          </div>
        </div>
      )}

      {/* Sales and Finance Charts */}
      {salesAndFinanceSection && (
        <div className="grid gap-4 md:grid-cols-2">
          {isRefreshing ? (
            <>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <Skeleton className="h-80 w-full" />
              </div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <Skeleton className="h-80 w-full" />
              </div>
            </>
          ) : (
            salesAndFinanceSection
          )}
        </div>
      )}

      {/* Activities Section */}
      {activitiesSection && (
        <div className="activities-section">
          {isRefreshing ? (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <Skeleton className="h-52 w-full" />
            </div>
          ) : (
            activitiesSection
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
