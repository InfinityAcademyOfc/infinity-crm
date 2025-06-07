
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useProfile } from "@/hooks/useProfile";

const CompanySettings = () => {
  const { toast } = useToast();
  const { settings, loading, updateSettings } = useCompanySettings();
  const { isCompanyAccount } = useProfile();
  
  const [formData, setFormData] = useState({
    company_name: "",
    company_description: "",
    business_type: "",
    contact_email: "",
    contact_phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "Brasil",
    timezone: "America/Sao_Paulo",
    currency: "BRL",
    language: "pt-BR"
  });
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings?.settings) {
      const s = settings.settings;
      setFormData({
        company_name: s.company_name || "",
        company_description: s.company_description || "",
        business_type: s.business_type || "",
        contact_email: s.contact_email || "",
        contact_phone: s.contact_phone || "",
        street: s.address?.street || "",
        city: s.address?.city || "",
        state: s.address?.state || "",
        zip: s.address?.zip || "",
        country: s.address?.country || "Brasil",
        timezone: s.preferences?.timezone || "America/Sao_Paulo",
        currency: s.preferences?.currency || "BRL",
        language: s.preferences?.language || "pt-BR"
      });
    }
  }, [settings]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const settingsData = {
        company_name: formData.company_name,
        company_description: formData.company_description,
        business_type: formData.business_type,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country
        },
        preferences: {
          timezone: formData.timezone,
          currency: formData.currency,
          language: formData.language
        }
      };

      await updateSettings(settingsData);
      toast({
        title: "Configurações salvas",
        description: "As configurações da empresa foram atualizadas com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isCompanyAccount) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            Esta seção está disponível apenas para contas de empresa.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Nome da Empresa</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="Nome da sua empresa"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business_type">Tipo de Negócio</Label>
              <Select value={formData.business_type} onValueChange={(value) => handleInputChange('business_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="servicos">Serviços</SelectItem>
                  <SelectItem value="comercio">Comércio</SelectItem>
                  <SelectItem value="industria">Indústria</SelectItem>
                  <SelectItem value="tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="consultoria">Consultoria</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_description">Descrição</Label>
            <Textarea
              id="company_description"
              value={formData.company_description}
              onChange={(e) => handleInputChange('company_description', e.target.value)}
              placeholder="Descreva brevemente sua empresa"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email de Contato</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                placeholder="contato@empresa.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Telefone de Contato</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                placeholder="(00) 0000-0000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Rua</Label>
            <Input
              id="street"
              value={formData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              placeholder="Rua, número, complemento"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Cidade"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="Estado"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zip">CEP</Label>
              <Input
                id="zip"
                value={formData.zip}
                onChange={(e) => handleInputChange('zip', e.target.value)}
                placeholder="00000-000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                  <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                  <SelectItem value="America/Rio_Branco">Rio Branco (GMT-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Moeda</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real (R$)</SelectItem>
                  <SelectItem value="USD">Dólar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (BR)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isSaving || loading}
          className="w-full md:w-auto"
        >
          {isSaving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
};

export default CompanySettings;
