
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ProfileSettings = () => {
  const { user, profile, company, isCompanyAccount } = useAuth();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: isCompanyAccount ? company?.name || "" : profile?.name || "",
    email: isCompanyAccount ? company?.email || "" : profile?.email || "",
    phone: profile?.phone || "",
    role: profile?.role || "",
    department: profile?.department || "",
    avatar: profile?.avatar || ""
  });

  const [companyData, setCompanyData] = useState({
    name: company?.name || "",
    email: company?.email || ""
  });

  const handleProfileUpdate = async () => {
    try {
      // Here you would update the profile via Supabase
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil.",
        variant: "destructive"
      });
    }
  };

  const handleCompanyUpdate = async () => {
    try {
      // Here you would update the company via Supabase
      toast({
        title: "Empresa atualizada",
        description: "Informações da empresa foram atualizadas com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar empresa.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center animate-fade-in">
        <p className="text-muted-foreground">Faça login para visualizar o perfil</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-semibold">Perfil</h2>
        <p className="text-muted-foreground mt-1">
          Gerencie suas informações pessoais e de empresa
        </p>
      </div>

      {/* Profile Information */}
      <Card className="animate-scale-in">
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais e configurações de conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileData.avatar} />
              <AvatarFallback className="text-lg">
                {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm" className="hover-scale transition-all duration-200">
                <Camera className="h-4 w-4 mr-2" />
                Alterar Foto
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG ou GIF. Máximo 2MB.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Cargo</Label>
              <Input
                id="role"
                value={profileData.role}
                onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value }))}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Input
              id="department"
              value={profileData.department}
              onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <Button onClick={handleProfileUpdate} className="hover-scale transition-all duration-200">
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>

      {/* Company Information */}
      {company && (
        <Card className="animate-scale-in" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informações da Empresa
            </CardTitle>
            <CardDescription>
              Gerencie as informações da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nome da Empresa</Label>
                <Input
                  id="company-name"
                  value={companyData.name}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, name: e.target.value }))}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email">Email da Empresa</Label>
                <Input
                  id="company-email"
                  type="email"
                  value={companyData.email}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, email: e.target.value }))}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <Button onClick={handleCompanyUpdate} className="hover-scale transition-all duration-200">
              <Save className="h-4 w-4 mr-2" />
              Salvar Informações da Empresa
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileSettings;
