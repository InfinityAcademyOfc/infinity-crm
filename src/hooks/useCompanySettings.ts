
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/profileService';
import { CompanySettings } from '@/types/profile';

export const useCompanySettings = () => {
  const { company } = useAuth();
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (company?.id) {
      loadSettings();
    }
  }, [company?.id]);

  const loadSettings = async () => {
    if (!company?.id) return;

    setLoading(true);
    try {
      const data = await profileService.getCompanySettings(company.id);
      setSettings(data);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: any) => {
    if (!company?.id) return null;

    setLoading(true);
    try {
      const result = await profileService.updateCompanySettings(company.id, newSettings);
      if (result) {
        setSettings(result);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    refreshSettings: loadSettings
  };
};
