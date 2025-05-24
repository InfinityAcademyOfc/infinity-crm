
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Target } from "lucide-react";
import { useRealClientData } from "@/hooks/useRealClientData";
import { useFinancialData } from "@/hooks/useFinancialData";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useGoals } from "@/hooks/useGoals";

const RealStatsSection = () => {
  const { clients, loading: clientsLoading } = useRealClientData();
  const { transactions, loading: transactionsLoading } = useFinancialData();
  const { teamMembers, loading: teamLoading } = useTeamMembers();
  const { goals, loading: goalsLoading } = useGoals();

  // Calculate metrics from real data
  const totalRevenue = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netProfit = totalRevenue - totalExpenses;
  
  const activeClients = clients.filter(c => c.status === 'active').length;
  const activeGoals = goals.filter(g => g.status === 'active').length;

  const stats = [
    {
      title: "Receita Total",
      value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`,
      icon: DollarSign,
      trend: totalRevenue > 0 ? "up" : "down",
      change: totalRevenue > 0 ? "+12%" : "0%"
    },
    {
      title: "Clientes Ativos",
      value: activeClients.toString(),
      icon: Users,
      trend: activeClients > 0 ? "up" : "down",
      change: activeClients > 0 ? "+5%" : "0%"
    },
    {
      title: "Lucro Líquido",
      value: `R$ ${netProfit.toLocaleString('pt-BR')}`,
      icon: TrendingUp,
      trend: netProfit > 0 ? "up" : "down",
      change: netProfit > 0 ? "+8%" : "0%"
    },
    {
      title: "Metas Ativas",
      value: activeGoals.toString(),
      icon: Target,
      trend: activeGoals > 0 ? "up" : "down",
      change: activeGoals > 0 ? "+3%" : "0%"
    }
  ];

  const isLoading = clientsLoading || transactionsLoading || teamLoading || goalsLoading;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carregando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">--</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {stat.change} em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RealStatsSection;
