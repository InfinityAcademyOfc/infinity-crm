
import { useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield, Settings as SettingsIcon, Zap, PieChart, CreditCard, Building2 } from "lucide-react";
import ProfileSettings from "@/components/settings/ProfileSettings";
import CompanySettings from "@/components/settings/CompanySettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import SystemSettings from "@/components/settings/SystemSettings";
import AutomationSettings from "@/components/settings/AutomationSettings";
import DashboardWidgetConfig from "@/components/dashboard/DashboardWidgetConfig";
import PlansSettings from "@/components/settings/PlansSettings";
import { useProfile } from "@/hooks/useProfile";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { isCompanyAccount } = useProfile();

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Configurações" 
        description="Gerencie suas preferências e dados de perfil"
      />
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-8 max-w-5xl">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          {isCompanyAccount && (
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 size={16} />
              <span className="hidden sm:inline">Empresa</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <CreditCard size={16} />
            <span className="hidden sm:inline">Planos</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield size={16} />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap size={16} />
            <span className="hidden sm:inline">Automação</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <PieChart size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <SettingsIcon size={16} />
            <span className="hidden sm:inline">Sistema</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>
        
        {isCompanyAccount && (
          <TabsContent value="company">
            <CompanySettings />
          </TabsContent>
        )}
        
        <TabsContent value="plans">
          <PlansSettings />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
        
        <TabsContent value="automation">
          <AutomationSettings />
        </TabsContent>
        
        <TabsContent value="dashboard">
          <DashboardWidgetConfig />
        </TabsContent>
        
        <TabsContent value="system">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
