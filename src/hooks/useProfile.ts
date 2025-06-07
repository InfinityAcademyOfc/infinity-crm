
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/profileService';
import { Profile, CompanyProfile } from '@/types/profile';

export const useProfile = () => {
  const { user, profile, companyProfile, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) return null;
    
    setLoading(true);
    try {
      const result = await profileService.updateProfile(user.id, updates);
      if (result) {
        await refreshUserData();
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyProfile = async (updates: Partial<CompanyProfile>) => {
    if (!user?.id) return null;
    
    setLoading(true);
    try {
      const result = await profileService.updateCompanyProfile(user.id, updates);
      if (result) {
        await refreshUserData();
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user?.id) return null;

    setLoading(true);
    try {
      const avatarUrl = await profileService.uploadAvatar(file, user.id);
      if (avatarUrl) {
        if (profile) {
          await updateProfile({ avatar_url: avatarUrl });
        } else if (companyProfile) {
          await updateCompanyProfile({ avatar_url: avatarUrl });
        }
      }
      return avatarUrl;
    } finally {
      setLoading(false);
    }
  };

  const removeAvatar = async () => {
    if (!user?.id) return false;

    setLoading(true);
    try {
      const currentAvatarUrl = profile?.avatar_url || companyProfile?.avatar_url;
      if (currentAvatarUrl) {
        const success = await profileService.removeAvatar(currentAvatarUrl);
        if (success) {
          if (profile) {
            await updateProfile({ avatar_url: null });
          } else if (companyProfile) {
            await updateCompanyProfile({ avatar_url: null });
          }
        }
        return success;
      }
      return true;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    companyProfile,
    loading,
    updateProfile,
    updateCompanyProfile,
    uploadAvatar,
    removeAvatar,
    isCompanyAccount: !!companyProfile
  };
};
