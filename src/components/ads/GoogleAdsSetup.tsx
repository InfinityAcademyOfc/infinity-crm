
import { useState } from "react";
import { AlertCircle, CheckCircle, Link, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface GoogleAdsSetupProps {
  connected: boolean;
  onConnect: () => void;
}

const GoogleAdsSetup = ({ connected, onConnect }: GoogleAdsSetupProps) => {
  const [adAccounts, setAdAccounts] = useState<string[]>([]);
  const [conversionId, setConversionId] = useState("");
  const [adAccountId, setAdAccountId] = useState("");
  const { toast } = useToast();

  const handleConnect = () => {
    // Simulando a conexão bem-sucedida com o Google Ads
    setTimeout(() => {
      setAdAccounts(["987-654-3210", "123-456-7890", "456-789-0123"]);
      setAdAccountId("987-654-3210");
      onConnect();
      
      toast({
        title: "Google Ads conectado",
        description: "Sua conta foi conectada com sucesso e os dados foram sincronizados.",
      });
    }, 1000);
  };

  const handleSaveConversion = () => {
    if (!conversionId.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um ID de Conversão válido",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Conversão configurada",
      description: `ID de Conversão ${conversionId} configurado com sucesso.`,
    });
  };

  if (!connected) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex items-start">
          <AlertCircle className="text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium mb-1">Conta não conectada</h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              Você precisa conectar sua conta do Google Ads para acessar os recursos de integração.
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto">
            <svg viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
              <path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4"/>
              <path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853"/>
              <path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04"/>
              <path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335"/>
            </svg>
          </div>
          <h3 className="text-xl font-medium">Conectar Google Ads</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Conecte sua conta do Google Ads para importar leads automaticamente das suas campanhas de busca e display.
          </p>
          <div className="pt-2">
            <Button onClick={handleConnect} className="mx-auto">
              Conectar com Google
            </Button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Ao conectar, você concorda com os termos de uso e política de privacidade.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-start">
        <CheckCircle className="text-green-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="font-medium mb-1">Conta conectada</h3>
          <p className="text-sm text-green-800 dark:text-green-300">
            Sua conta do Google Ads está conectada e pronta para importar leads.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Configurações da Conta</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Conta de Anúncios</label>
            <Select value={adAccountId} onValueChange={setAdAccountId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma conta" />
              </SelectTrigger>
              <SelectContent>
                {adAccounts.map(account => (
                  <SelectItem key={account} value={account}>
                    {account}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">ID de Conversão</label>
            <div className="flex space-x-2">
              <Input 
                value={conversionId} 
                onChange={(e) => setConversionId(e.target.value)} 
                placeholder="Exemplo: AW-123456789"
              />
              <Button onClick={handleSaveConversion}>Salvar</Button>
            </div>
            <p className="text-xs text-gray-500">
              O ID de Conversão é usado para rastrear conversões nos seus anúncios
            </p>
          </div>
          
          <div className="pt-4">
            <a 
              href="https://support.google.com/google-ads/answer/6095821" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ExternalLink size={14} className="mr-1" />
              Como encontrar seu ID de Conversão?
            </a>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Status da Integração</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <div className="flex items-center">
                <CheckCircle size={18} className="text-green-500 mr-2" />
                <span>Autenticação da API</span>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400">Completo</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <div className="flex items-center">
                <CheckCircle size={18} className="text-green-500 mr-2" />
                <span>Acesso à conta de anúncios</span>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400">Completo</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <div className="flex items-center">
                {conversionId ? (
                  <CheckCircle size={18} className="text-green-500 mr-2" />
                ) : (
                  <AlertCircle size={18} className="text-yellow-500 mr-2" />
                )}
                <span>Configuração de Conversão</span>
              </div>
              <span className={`text-sm ${conversionId ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                {conversionId ? 'Completo' : 'Pendente'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <div className="flex items-center">
                <CheckCircle size={18} className="text-green-500 mr-2" />
                <span>Webhook para leads</span>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400">Ativo</span>
            </div>
          </div>
          
          <div className="pt-4">
            <Button variant="outline" className="w-full flex items-center justify-center">
              <Link size={16} className="mr-2" />
              Testar Conexão
            </Button>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <h3 className="text-lg font-medium mb-3">Campanhas Conectadas</h3>
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-3 font-medium bg-gray-50 dark:bg-gray-800 text-sm">
            <div>Nome da Campanha</div>
            <div>Status</div>
            <div>Leads Capturados</div>
            <div>Última Atualização</div>
          </div>
          
          <div className="divide-y">
            <div className="grid grid-cols-4 gap-4 p-3 text-sm">
              <div>Campanha de Busca - Inverno</div>
              <div className="text-green-600 dark:text-green-400">Ativa</div>
              <div>36</div>
              <div>Hoje às 10:15</div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 p-3 text-sm">
              <div>Campanha de Display - Geral</div>
              <div className="text-green-600 dark:text-green-400">Ativa</div>
              <div>18</div>
              <div>Ontem às 20:30</div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 p-3 text-sm">
              <div>Campanha Promocional - Abril</div>
              <div className="text-yellow-600 dark:text-yellow-400">Pausada</div>
              <div>24</div>
              <div>15/04/2023</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAdsSetup;
