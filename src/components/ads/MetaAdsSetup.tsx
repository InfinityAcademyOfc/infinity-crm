
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

interface MetaAdsSetupProps {
  connected: boolean;
  onConnect: () => void;
}

const MetaAdsSetup = ({ connected, onConnect }: MetaAdsSetupProps) => {
  const [adAccounts, setAdAccounts] = useState<string[]>([]);
  const [pixelId, setPixelId] = useState("");
  const [adAccountId, setAdAccountId] = useState("");
  const { toast } = useToast();

  const handleConnect = () => {
    // Simulando a conexão bem-sucedida com o Meta Ads
    setTimeout(() => {
      setAdAccounts(["123456789", "987654321", "543216789"]);
      setAdAccountId("123456789");
      onConnect();
      
      toast({
        title: "Meta Ads conectado",
        description: "Sua conta foi conectada com sucesso e os dados foram sincronizados.",
      });
    }, 1000);
  };

  const handleSavePixel = () => {
    if (!pixelId.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um ID de Pixel válido",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Pixel configurado",
      description: `Pixel ID ${pixelId} configurado com sucesso.`,
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
              Você precisa conectar sua conta do Meta Ads para acessar os recursos de integração.
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto">
            <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
              <path fill="#1877F2" d="M36 18C36 8.059 27.941 0 18 0C8.059 0 0 8.059 0 18C0 26.99 6.584 34.453 15.188 35.773V23.203H10.617V18H15.188V14.039C15.188 9.527 17.88 7.031 21.994 7.031C23.965 7.031 26.031 7.383 26.031 7.383V11.813H23.764C21.533 11.813 20.813 13.193 20.813 14.613V18H25.816L25.002 23.203H20.813V35.773C29.416 34.453 36 26.99 36 18Z"/>
            </svg>
          </div>
          <h3 className="text-xl font-medium">Conectar Meta Ads</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Conecte sua conta do Meta Ads para importar leads automaticamente dos seus anúncios do Facebook e Instagram.
          </p>
          <div className="pt-2">
            <Button onClick={handleConnect} className="mx-auto">
              Conectar com Meta
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
            Sua conta do Meta Ads está conectada e pronta para importar leads.
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
            <label className="text-sm font-medium">ID do Pixel</label>
            <div className="flex space-x-2">
              <Input 
                value={pixelId} 
                onChange={(e) => setPixelId(e.target.value)} 
                placeholder="Exemplo: 123456789012345"
              />
              <Button onClick={handleSavePixel}>Salvar</Button>
            </div>
            <p className="text-xs text-gray-500">
              O Pixel é usado para rastrear conversões nos seus anúncios
            </p>
          </div>
          
          <div className="pt-4">
            <a 
              href="https://business.facebook.com/business/help/952192354843755" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ExternalLink size={14} className="mr-1" />
              Como encontrar seu Pixel ID?
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
                {pixelId ? (
                  <CheckCircle size={18} className="text-green-500 mr-2" />
                ) : (
                  <AlertCircle size={18} className="text-yellow-500 mr-2" />
                )}
                <span>Configuração de Pixel</span>
              </div>
              <span className={`text-sm ${pixelId ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                {pixelId ? 'Completo' : 'Pendente'}
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
              <div>Campanha de Verão 2023</div>
              <div className="text-green-600 dark:text-green-400">Ativa</div>
              <div>42</div>
              <div>Hoje às 14:30</div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 p-3 text-sm">
              <div>Promoção de Produtos Novos</div>
              <div className="text-green-600 dark:text-green-400">Ativa</div>
              <div>28</div>
              <div>Ontem às 18:15</div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 p-3 text-sm">
              <div>Campanha de Remarketing</div>
              <div className="text-yellow-600 dark:text-yellow-400">Pausada</div>
              <div>15</div>
              <div>22/03/2023</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaAdsSetup;
