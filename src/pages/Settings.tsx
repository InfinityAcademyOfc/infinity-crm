
import React, { useState } from 'react';
import { SectionHeader } from '@/components/ui/section-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield, Zap, CreditCard, MessageSquare } from 'lucide-react';
import ProfileSettings from '@/components/settings/ProfileSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import AutomationSettings from '@/components/settings/AutomationSettings';
import PlansSettings from '@/components/settings/PlansSettings';
import WhatsAppSettings from '@/components/settings/WhatsAppSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Configurações" 
        description="Gerencie suas preferências e configurações do sistema"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Automação
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Planos
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            WhatsApp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="automation">
          <AutomationSettings />
        </TabsContent>

        <TabsContent value="plans">
          <PlansSettings />
        </TabsContent>

        <TabsContent value="whatsapp">
          <WhatsAppSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
