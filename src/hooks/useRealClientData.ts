
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  contact: string;
  segment: string;
  status: 'active' | 'inactive' | 'prospect';
  street: string;
  city: string;
  state: string;
  zip: string;
  company_id: string;
  last_contact: string | null;
  created_at: string;
  updated_at: string;
}

export const useRealClientData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { company } = useAuth();

  const fetchClients = async () => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar clientes:', error);
        toast.error('Erro ao carregar clientes');
        return;
      }

      // Type assertion with validation for status
      const validatedData = (data || []).map(client => ({
        ...client,
        status: (['active', 'inactive', 'prospect'].includes(client.status) 
          ? client.status 
          : 'active') as 'active' | 'inactive' | 'prospect'
      })) as Client[];

      setClients(validatedData);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: Omit<Client, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    if (!company?.id) {
      toast.error('Empresa não encontrada');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([
          {
            ...clientData,
            company_id: company.id
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar cliente:', error);
        toast.error('Erro ao criar cliente');
        return;
      }

      const validatedData = {
        ...data,
        status: (['active', 'inactive', 'prospect'].includes(data.status) 
          ? data.status 
          : 'active') as 'active' | 'inactive' | 'prospect'
      } as Client;

      setClients(prev => [validatedData, ...prev]);
      toast.success('Cliente criado com sucesso!');
      return validatedData;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast.error('Erro ao criar cliente');
    }
  };

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar cliente:', error);
        toast.error('Erro ao atualizar cliente');
        return;
      }

      const validatedData = {
        ...data,
        status: (['active', 'inactive', 'prospect'].includes(data.status) 
          ? data.status 
          : 'active') as 'active' | 'inactive' | 'prospect'
      } as Client;

      setClients(prev => prev.map(client => 
        client.id === id ? validatedData : client
      ));
      toast.success('Cliente atualizado com sucesso!');
      return validatedData;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast.error('Erro ao atualizar cliente');
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar cliente:', error);
        toast.error('Erro ao deletar cliente');
        return;
      }

      setClients(prev => prev.filter(client => client.id !== id));
      toast.success('Cliente removido com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      toast.error('Erro ao deletar cliente');
    }
  };

  const refetch = () => {
    setLoading(true);
    fetchClients();
  };

  useEffect(() => {
    fetchClients();
  }, [company?.id]);

  return {
    clients,
    loading,
    createClient,
    updateClient,
    deleteClient,
    refetch
  };
};
