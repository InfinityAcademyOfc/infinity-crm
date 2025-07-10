
import { useState, useEffect } from "react";
import { clientAnalyticsService, ClientLTV, ClientNPS, ClientSatisfaction } from "@/services/api/clientAnalyticsService";
import { useToast } from "@/hooks/use-toast";

export function useClientAnalytics(companyId: string) {
  const [clientLTV, setClientLTV] = useState<ClientLTV[]>([]);
  const [clientNPS, setClientNPS] = useState<ClientNPS[]>([]);
  const [clientSatisfaction, setClientSatisfaction] = useState<ClientSatisfaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!companyId) return;

    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const [ltv, nps, satisfaction] = await Promise.all([
          clientAnalyticsService.getClientLTV(companyId),
          clientAnalyticsService.getClientNPS(companyId),
          clientAnalyticsService.getClientSatisfaction(companyId)
        ]);
        
        setClientLTV(ltv);
        setClientNPS(nps);
        setClientSatisfaction(satisfaction);
      } catch (error) {
        console.error("Erro ao carregar analytics dos clientes:", error);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados analíticos dos clientes",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [companyId, toast]);

  const updateLTV = async (clientId: string, data: Partial<ClientLTV>) => {
    const result = await clientAnalyticsService.updateClientLTV(clientId, companyId, data);
    if (result) {
      setClientLTV(current => 
        current.some(ltv => ltv.client_id === clientId)
          ? current.map(ltv => ltv.client_id === clientId ? result : ltv)
          : [...current, result]
      );
      return result;
    }
    return null;
  };

  const addNPS = async (npsData: Omit<ClientNPS, 'id' | 'created_at'>) => {
    const result = await clientAnalyticsService.createClientNPS(npsData);
    if (result) {
      setClientNPS(current => [result, ...current]);
      return result;
    }
    return null;
  };

  const addSatisfaction = async (satisfactionData: Omit<ClientSatisfaction, 'id' | 'created_at'>) => {
    const result = await clientAnalyticsService.createClientSatisfaction(satisfactionData);
    if (result) {
      setClientSatisfaction(current => [result, ...current]);
      return result;
    }
    return null;
  };

  const convertLeadToClient = async (leadId: string, clientData: any) => {
    return await clientAnalyticsService.convertLeadToClient(leadId, clientData);
  };

  // Calculate aggregated metrics
  const metrics = {
    averageLTV: clientLTV.length > 0 ? clientLTV.reduce((sum, ltv) => sum + ltv.calculated_ltv, 0) / clientLTV.length : 0,
    totalRevenue: clientLTV.reduce((sum, ltv) => sum + ltv.total_revenue, 0),
    averageNPS: clientNPS.length > 0 ? clientNPS.reduce((sum, nps) => sum + nps.score, 0) / clientNPS.length : 0,
    averageSatisfaction: clientSatisfaction.length > 0 ? clientSatisfaction.reduce((sum, sat) => sum + sat.rating, 0) / clientSatisfaction.length : 0,
    npsDistribution: {
      promoters: clientNPS.filter(nps => nps.score >= 9).length,
      passives: clientNPS.filter(nps => nps.score >= 7 && nps.score <= 8).length,
      detractors: clientNPS.filter(nps => nps.score <= 6).length
    }
  };

  return {
    clientLTV,
    clientNPS,
    clientSatisfaction,
    loading,
    metrics,
    updateLTV,
    addNPS,
    addSatisfaction,
    convertLeadToClient
  };
}
