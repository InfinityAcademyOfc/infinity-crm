
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Star, DollarSign } from "lucide-react";

interface ClientMetricsCardsProps {
  metrics: {
    averageLTV: number;
    totalRevenue: number;
    averageNPS: number;
    averageSatisfaction: number;
    npsDistribution: {
      promoters: number;
      passives: number;
      detractors: number;
    };
  };
  totalClients: number;
}

export const ClientMetricsCards: React.FC<ClientMetricsCardsProps> = ({
  metrics,
  totalClients
}) => {
  const npsScore = metrics.npsDistribution.promoters + metrics.npsDistribution.passives + metrics.npsDistribution.detractors > 0
    ? Math.round(((metrics.npsDistribution.promoters - metrics.npsDistribution.detractors) / (metrics.npsDistribution.promoters + metrics.npsDistribution.passives + metrics.npsDistribution.detractors)) * 100)
    : 0;

  const getNPSColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getNPSLabel = (score: number) => {
    if (score >= 70) return "Excelente";
    if (score >= 50) return "Muito Bom";
    if (score >= 30) return "Bom";
    if (score >= 0) return "Regular";
    return "Ruim";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClients}</div>
          <p className="text-xs text-muted-foreground">
            Base ativa de clientes
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">LTV Médio</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {metrics.averageLTV.toLocaleString('pt-BR', { 
              minimumFractionDigits: 0, 
              maximumFractionDigits: 0 
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            Valor médio por cliente
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className={`text-2xl font-bold ${getNPSColor(npsScore)}`}>
              {npsScore}
            </div>
            <Badge variant="outline" className="text-xs">
              {getNPSLabel(npsScore)}
            </Badge>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Promotores: {metrics.npsDistribution.promoters}</span>
              <span>Detratores: {metrics.npsDistribution.detractors}</span>
            </div>
            <Progress value={npsScore + 100} max={200} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Satisfação Média</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.averageSatisfaction.toFixed(1)}/5
          </div>
          <div className="flex items-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(metrics.averageSatisfaction)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Avaliação geral dos clientes
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
