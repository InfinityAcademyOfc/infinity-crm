
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  department: string;
  avatar: string;
  company_name?: string;
}

const ProfileSettings = () => {
  const { user, profile, company, isCompany } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    department: "",
    avatar: "",
    company_name: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user && (profile || company)) {
      const data = isCompany ? company : profile;
      setProfileData({
        name: data?.name || "",
        email: data?.email || user.email || "",
        phone: data?.phone || "",
        department: data?.department || "",
        avatar: data?.avatar || "",
        company_name: isCompany ? data?.name : company?.name || ""
      });
      setLoading(false);
    }
  }, [user, profile, company, isCompany]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfileData(prev => ({ ...prev, avatar: publicUrl }));
      toast.success("Avatar atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload do avatar:", error);
      toast.error("Erro ao fazer upload do avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      
      const tableName = isCompany ? "profiles_companies" : "profiles";
      const updateData = {
        name: profileData.name,
        phone: profileData.phone,
        avatar: profileData.avatar,
        ...(isCompany ? {} : { department: profileData.department }),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      toast.error("Erro ao salvar perfil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Perfil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profileData.avatar} />
            <AvatarFallback>
              {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <Button variant="outline" size="sm" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Alterar Avatar
                  </>
                )}
              </Button>
            </Label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {isCompany ? "Nome da Empresa" : "Nome Completo"}
            </Label>
            <Input
              id="name"
              value={profileData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder={isCompany ? "Digite o nome da empresa" : "Digite seu nome completo"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              disabled
              className="bg-gray-100"
            />
            <p className="text-xs text-muted-foreground">
              O email não pode ser alterado aqui
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={profileData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>

          {!isCompany && (
            <div className="space-y-2">
              <Label htmlFor="department">Cargo/Departamento</Label>
              <Input
                id="department"
                value={profileData.department}
                onChange={(e) => handleInputChange("department", e.target.value)}
                placeholder="Ex: Desenvolvedor, Vendas, Marketing"
              />
            </div>
          )}

          {!isCompany && profileData.company_name && (
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={profileData.company_name}
                disabled
                className="bg-gray-100"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
