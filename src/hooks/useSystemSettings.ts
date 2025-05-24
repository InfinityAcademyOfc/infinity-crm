
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  company_id: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useSystemSettings = () => {
  const { company, user } = useAuth();
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    if (!company?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('company_id', company.id);

      if (error) throw error;
      
      const settingsMap = (data || []).reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {} as Record<string, any>);
      
      setSettings(settingsMap);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    if (!company?.id || !user?.id) return;

    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          company_id: company.id,
          updated_by: user.id
        });

      if (error) throw error;
      
      setSettings(prev => ({ ...prev, [key]: value }));
      toast.success('Configuração atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      toast.error('Erro ao atualizar configuração');
      throw error;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [company]);

  return {
    settings,
    loading,
    updateSetting,
    refetch: fetchSettings
  };
};
