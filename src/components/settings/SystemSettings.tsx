
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Upload, Globe } from "lucide-react";

const SystemSettings = () => {
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Sistema</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Modo escuro</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Ativar/desativar o tema escuro</p>
          </div>
          <Switch defaultChecked={isDarkMode} />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Idioma do sistema</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Selecione o idioma de exibição</p>
          </div>
          <select className="bg-transparent border rounded-md py-1 px-2 border-gray-300 dark:border-gray-700">
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es">Español</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Formato de data</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Escolha o formato de exibição de data</p>
          </div>
          <select className="bg-transparent border rounded-md py-1 px-2 border-gray-300 dark:border-gray-700">
            <option value="dd/mm/yyyy">DD/MM/AAAA</option>
            <option value="mm/dd/yyyy">MM/DD/AAAA</option>
            <option value="yyyy-mm-dd">AAAA-MM-DD</option>
          </select>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-lg font-medium mb-4">Importação e Exportação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Upload size={16} />
              Importar Dados
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Globe size={16} />
              Exportar Dados
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;
