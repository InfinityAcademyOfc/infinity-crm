import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { userService } from "@/services/api/userService";

const ProfileSettings = () => {
  const { toast } = useToast();
  const { user, profile, refreshUserData } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    phone: ""
  });
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        role: profile.role || "",
        phone: profile.phone || ""
      });
      
      // Use either avatar or avatar_url
      if (profile.avatar || profile.avatar_url) {
        setProfileImage(profile.avatar || profile.avatar_url);
      }
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    try {
      setUploadingImage(true);
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
        
      // Update the profile with the new avatar URL
      if (user.id) {
        const updatedProfile = await userService.updateAvatar(user.id, publicUrl);
        if (updatedProfile) {
          setProfileImage(publicUrl);
          // Refresh user data in context
          await refreshUserData();
        }
      }
      
      toast({
        title: "Imagem atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso."
      });
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      toast({
        title: "Erro ao atualizar imagem",
        description: "Não foi possível atualizar sua foto de perfil.",
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!user?.id || !(profile?.avatar || profile?.avatar_url)) return;
    
    try {
      // Extract file name from URL
      const avatarUrl = profile.avatar || profile.avatar_url;
      if (!avatarUrl) return;
      
      const urlParts = avatarUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `avatars/${fileName}`;
      
      // Remove file from storage (optional, can keep old files)
      await supabase.storage
        .from('profiles')
        .remove([filePath]);
      
      // Update profile to remove avatar reference
      const updatedProfile = await userService.updateAvatar(user.id, "");
      
      if (updatedProfile) {
        setProfileImage(null);
        await refreshUserData();
      }
      
      toast({
        title: "Imagem removida",
        description: "Sua foto de perfil foi removida com sucesso."
      });
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
      toast({
        title: "Erro ao remover imagem",
        description: "Não foi possível remover sua foto de perfil.",
        variant: "destructive"
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    
    try {
      setIsSaving(true);
      
      const updatedProfile = await userService.updateUserProfile(user.id, {
        name: formData.name,
        phone: formData.phone
      });
      
      if (updatedProfile) {
        await refreshUserData();
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram atualizadas com sucesso."
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível atualizar suas informações.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Obter as iniciais do nome para o avatar fallback
  const getInitials = () => {
    if (!formData.name) return "U";
    
    const nameParts = formData.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Perfil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profileImage || "/avatar-placeholder.jpg"} alt="Foto de perfil" className="object-cover" />
              <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col items-center">
              <Label htmlFor="picture" className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors">
                <Camera size={16} />
                {uploadingImage ? "Carregando..." : "Alterar foto"}
              </Label>
              <Input id="picture" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
              {profileImage && (
                <Button variant="link" size="sm" onClick={handleRemoveImage} className="mt-2">
                  Remover foto
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Seu nome completo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                disabled 
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Cargo</Label>
              <Input 
                id="role" 
                value={formData.role} 
                disabled 
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone" 
                value={formData.phone} 
                onChange={handleInputChange} 
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            className="mt-4" 
            onClick={handleSaveProfile} 
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
