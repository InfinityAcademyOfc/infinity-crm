import { useState } from "react";
import { Facebook, AlertCircle, CheckCircle, Database, BarChart3, Zap, Settings, ArrowRight, Users, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import LeadMappingConfig from "./LeadMappingConfig";
import AdsAnalytics from "./AdsAnalytics";
import MetaAdsSetup from "./MetaAdsSetup";
import GoogleAdsSetup from "./GoogleAdsSetup";
const AdsIntegration = () => {
  const [metaConnected, setMetaConnected] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("facebook");
  const {
    toast
  } = useToast();
  const handleConnectMeta = () => {
    // In a real implementation, this would handle OAuth flow with Meta Ads
    window.open("https://developers.facebook.com/docs/marketing-api/get-started", "_blank");
    toast({
      title: "Redirecionando para Meta Ads",
      description: "Você será redirecionado para autorizar o acesso à API de Marketing do Facebook."
    });
  };
  const handleConnectGoogle = () => {
    // In a real implementation, this would handle OAuth flow with Google Ads
    window.open("https://developers.google.com/google-ads/api/docs/oauth/overview", "_blank");
    toast({
      title: "Redirecionando para Google Ads",
      description: "Você será redirecionado para autorizar o acesso à API do Google Ads."
    });
  };
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div>
          
          
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-md">
                  <Facebook size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Meta Ads</CardTitle>
              </div>
              <div className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${metaConnected ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                {metaConnected ? <>
                    <CheckCircle size={12} />
                    <span>Conectado</span>
                  </> : <>
                    <AlertCircle size={12} />
                    <span>Desconectado</span>
                  </>}
              </div>
            </div>
            <CardDescription>
              Integração com Facebook e Instagram Ads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm">
                {metaConnected ? "Sua conta do Meta Ads está conectada e pronta para capturar leads." : "Conecte sua conta para sincronizar leads dos anúncios do Facebook e Instagram."}
              </div>
              
              <Button onClick={() => {
              setActiveTab("facebook");
              handleConnectMeta();
            }} className="w-full flex items-center justify-center">
                <ExternalLink size={16} className="mr-2" />
                {metaConnected ? "Gerenciar Conexão" : "Conectar com Meta Ads"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-md">
                  <svg viewBox="0 0 24 24" width="24" height="24" className="text-red-600 dark:text-red-400">
                    <path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm0-8Z" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Google Ads</CardTitle>
              </div>
              <div className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${googleConnected ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                {googleConnected ? <>
                    <CheckCircle size={12} />
                    <span>Conectado</span>
                  </> : <>
                    <AlertCircle size={12} />
                    <span>Desconectado</span>
                  </>}
              </div>
            </div>
            <CardDescription>
              Integração com Google Ads e Campanhas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm">
                {googleConnected ? "Sua conta do Google Ads está conectada e pronta para capturar leads." : "Conecte sua conta para sincronizar leads das campanhas do Google Ads."}
              </div>
              
              <Button onClick={() => {
              setActiveTab("google");
              handleConnectGoogle();
            }} className="w-full flex items-center justify-center">
                <ExternalLink size={16} className="mr-2" />
                {googleConnected ? "Gerenciar Conexão" : "Conectar com Google Ads"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-md">
                <Zap size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-lg">Automação de Leads</CardTitle>
            </div>
            <CardDescription>
              Configure o fluxo automático de leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Status da configuração:</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs rounded-full">
                  Não configurado
                </span>
              </div>
              
              <Button variant="outline" className="w-full" onClick={() => setActiveTab("config")}>
                Configurar Mapeamento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader className="pb-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="facebook">
                <Facebook className="mr-2 h-4 w-4" />
                Meta Ads
              </TabsTrigger>
              <TabsTrigger value="google">
                <svg viewBox="0 0 24 24" width="16" height="16" className="mr-2">
                  <path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm0-8Z" />
                </svg>
                Google Ads
              </TabsTrigger>
              <TabsTrigger value="config">
                <Settings className="mr-2 h-4 w-4" />
                Configuração
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="facebook" className="mt-0">
              <div className="p-6 space-y-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex items-start">
                  <AlertCircle className="text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Integração com Meta Ads API</h3>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      Para integrar com Meta Ads, você precisará:
                    </p>
                    <ul className="text-sm text-yellow-800 dark:text-yellow-300 list-disc ml-5 mt-2">
                      <li>Uma conta Business no Facebook</li>
                      <li>Um aplicativo Facebook para desenvolvedores</li>
                      <li>Permissões para acessar a Marketing API</li>
                      <li>Configuração de um Webhook para captura de leads</li>
                    </ul>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">1. Crie um aplicativo no Facebook para Desenvolvedores</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Acesse developers.facebook.com e crie um aplicativo do tipo "Business".
                    </p>
                    <Button variant="outline" size="sm" className="flex items-center" onClick={() => window.open("https://developers.facebook.com/apps/create/", "_blank")}>
                      <ExternalLink size={14} className="mr-2" />
                      Acessar Facebook para Desenvolvedores
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">2. Configure as permissões da API</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Adicione a Marketing API ao seu aplicativo e solicite as permissões necessárias.
                    </p>
                    <Button variant="outline" size="sm" className="flex items-center" onClick={() => window.open("https://developers.facebook.com/docs/marketing-api/get-started", "_blank")}>
                      <ExternalLink size={14} className="mr-2" />
                      Documentação da Marketing API
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">3. Configure o Webhook para Leads</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Configure um Webhook para receber leads em tempo real das suas campanhas do Facebook.
                    </p>
                    <Button variant="outline" size="sm" className="flex items-center" onClick={() => window.open("https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving/", "_blank")}>
                      <ExternalLink size={14} className="mr-2" />
                      Configurar Webhook para Lead Ads
                    </Button>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Após completar a configuração</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Volte a esta tela e insira os dados de autenticação da sua aplicação para finalizar a integração.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="google" className="mt-0">
              <div className="p-6 space-y-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex items-start">
                  <AlertCircle className="text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Integração com Google Ads API</h3>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      Para integrar com Google Ads, você precisará:
                    </p>
                    <ul className="text-sm text-yellow-800 dark:text-yellow-300 list-disc ml-5 mt-2">
                      <li>Uma conta Google Ads com permissão para acesso à API</li>
                      <li>Um projeto no Google Cloud Console</li>
                      <li>Credenciais OAuth2 configuradas</li>
                      <li>Acesso à API Google Ads aprovado</li>
                    </ul>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">1. Crie um projeto no Google Cloud Console</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Acesse console.cloud.google.com e crie um novo projeto.
                    </p>
                    <Button variant="outline" size="sm" className="flex items-center" onClick={() => window.open("https://console.cloud.google.com/projectcreate", "_blank")}>
                      <ExternalLink size={14} className="mr-2" />
                      Acessar Google Cloud Console
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">2. Configure credenciais OAuth2</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Crie credenciais OAuth2 para seu projeto e configure as telas de consentimento.
                    </p>
                    <Button variant="outline" size="sm" className="flex items-center" onClick={() => window.open("https://console.cloud.google.com/apis/credentials", "_blank")}>
                      <ExternalLink size={14} className="mr-2" />
                      Configurar Credenciais
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">3. Habilite a API Google Ads</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Ative a API Google Ads para seu projeto e solicite acesso para sua conta.
                    </p>
                    <Button variant="outline" size="sm" className="flex items-center" onClick={() => window.open("https://developers.google.com/google-ads/api/docs/oauth/cloud-project", "_blank")}>
                      <ExternalLink size={14} className="mr-2" />
                      Documentação da Google Ads API
                    </Button>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Após completar a configuração</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Volte a esta tela e insira as credenciais do seu projeto para finalizar a integração com o Google Ads.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="config" className="mt-0">
              <LeadMappingConfig />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0">
              <AdsAnalytics />
            </TabsContent>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-6">
          {/* The content is now managed by TabsContent */}
        </CardContent>
      </Card>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full mr-4">
            <Database size={24} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Fluxo de Leads Automatizado</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Leads capturados nos anúncios são automaticamente adicionados ao seu funil de vendas
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-3 w-full md:w-auto">
          <Button variant="outline" onClick={() => {
          toast({
            title: "Tutorial iniciado",
            description: "Guia de integração de anúncios aberto."
          });
        }}>
            Ver Tutorial
          </Button>
          <Button onClick={() => {
          window.location.href = "/app/sales-funnel";
        }}>
            <Users className="mr-2 h-4 w-4" />
            Ver Leads Capturados
          </Button>
        </div>
      </div>
    </div>;
};
export default AdsIntegration;