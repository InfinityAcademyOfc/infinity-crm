
import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";

const ProfileSettings = () => {
  const { toast } = useToast();
  const { 
    profile, 
    companyProfile, 
    loading, 
    updateProfile, 
    updateCompanyProfile,
    uploadAvatar,
    removeAvatar,
    isCompanyAccount 
  } = useProfile();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: ""
  });
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const currentProfile = isCompanyAccount ? companyProfile : profile;
    if (currentProfile) {
      setFormData({
        name: currentProfile.name || "",
        email: currentProfile.email || "",
        phone: currentProfile.phone || "",
        department: !isCompanyAccount ? (profile?.department || "") : ""
      });
    }
  }, [profile, companyProfile, isCompanyAccount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    try {
      await uploadAvatar(file);
      toast({
        title: "Imagem atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso."
      });
    } catch (error) {
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
    try {
      await removeAvatar();
      toast({
        title: "Imagem removida",
        description: "Sua foto de perfil foi removida com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao remover imagem",
        description: "Não foi possível remover sua foto de perfil.",
        variant: "destructive"
      });
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      if (isCompanyAccount && companyProfile) {
        await updateCompanyProfile({
          name: formData.name,
          phone: formData.phone
        });
      } else if (profile) {
        await updateProfile({
          name: formData.name,
          phone: formData.phone,
          department: formData.department
        });
      }
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível atualizar suas informações.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    if (!formData.name) return "U";
    
    const nameParts = formData.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  };

  const currentProfile = isCompanyAccount ? companyProfile : profile;
  const avatarUrl = currentProfile?.avatar_url;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isCompanyAccount ? "Informações da Empresa" : "Informações do Perfil"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={avatarUrl || ""} alt="Foto de perfil" className="object-cover" />
              <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col items-center">
              <Label htmlFor="picture" className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors">
                <Camera size={16} />
                {uploadingImage ? "Carregando..." : "Alterar foto"}
              </Label>
              <Input 
                id="picture" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
                disabled={uploadingImage} 
              />
              {avatarUrl && (
                <Button variant="link" size="sm" onClick={handleRemoveImage} className="mt-2">
                  Remover foto
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {isCompanyAccount ? "Nome da Empresa" : "Nome completo"}
              </Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder={isCompanyAccount ? "Nome da empresa" : "Seu nome completo"}
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
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone" 
                value={formData.phone} 
                onChange={handleInputChange} 
                placeholder="(00) 00000-0000"
              />
            </div>

            {!isCompanyAccount && (
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Input 
                  id="department" 
                  value={formData.department} 
                  onChange={handleInputChange} 
                  placeholder="Seu departamento"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            className="mt-4" 
            onClick={handleSaveProfile} 
            disabled={isSaving || loading}
          >
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
