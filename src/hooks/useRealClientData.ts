
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Client {
  id: string;
  name: string;
  contact: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  segment: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  last_contact: string | null;
  created_at: string;
  updated_at: string;
  company_id: string;
}

export interface ClientNPS {
  id: string;
  client_id: string;
  score: number;
  feedback: string | null;
  created_at: string;
  company_id: string;
}

export interface ClientSatisfaction {
  id: string;
  client_id: string;
  rating: number;
  category: string;
  comments: string | null;
  created_at: string;
  company_id: string;
}

export interface ClientLTV {
  id: string;
  client_id: string;
  total_revenue: number;
  calculated_ltv: number;
  first_purchase_date: string | null;
  last_purchase_date: string | null;
  purchase_frequency: number;
  updated_at: string;
  company_id: string;
}

export const useRealClientData = () => {
  const { company } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [clientNPS, setClientNPS] = useState<ClientNPS[]>([]);
  const [clientSatisfaction, setClientSatisfaction] = useState<ClientSatisfaction[]>([]);
  const [clientLTV, setClientLTV] = useState<ClientLTV[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllClientData = async () => {
    if (!company?.id) return;

    setLoading(true);
    try {
      // Fetch all client-related data in parallel
      const [
        clientsResponse,
        npsResponse,
        satisfactionResponse,
        ltvResponse
      ] = await Promise.all([
        supabase.from('clients').select('*').eq('company_id', company.id),
        supabase.from('client_nps').select('*').eq('company_id', company.id),
        supabase.from('client_satisfaction').select('*').eq('company_id', company.id),
        supabase.from('client_ltv').select('*').eq('company_id', company.id)
      ]);

      if (clientsResponse.error) throw clientsResponse.error;
      if (npsResponse.error) throw npsResponse.error;
      if (satisfactionResponse.error) throw satisfactionResponse.error;
      if (ltvResponse.error) throw ltvResponse.error;

      setClients(clientsResponse.data || []);
      setClientNPS(npsResponse.data || []);
      setClientSatisfaction(satisfactionResponse.data || []);
      setClientLTV(ltvResponse.data || []);
    } catch (error) {
      console.error('Erro ao buscar dados de clientes:', error);
      toast.error('Erro ao carregar dados de clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllClientData();
  }, [company]);

  // Calculate analytics from real data
  const analytics = {
    npsData: clientNPS.reduce((acc, nps) => {
      if (nps.score >= 9) acc.promoters += 1;
      else if (nps.score >= 7) acc.neutrals += 1;
      else acc.detractors += 1;
      return acc;
    }, { promoters: 0, neutrals: 0, detractors: 0 }),
    
    averageLTV: clientLTV.length > 0 
      ? clientLTV.reduce((sum, ltv) => sum + ltv.calculated_ltv, 0) / clientLTV.length 
      : 0,
      
    satisfactionAverage: clientSatisfaction.length > 0
      ? clientSatisfaction.reduce((sum, sat) => sum + sat.rating, 0) / clientSatisfaction.length
      : 0
  };

  return {
    clients,
    clientNPS,
    clientSatisfaction,
    clientLTV,
    analytics,
    loading,
    refetch: fetchAllClientData
  };
};
