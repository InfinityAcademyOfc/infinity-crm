
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

const AdsIntegrationPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integração com Anúncios</h1>
        <p className="text-muted-foreground">
          Conecte suas campanhas de Facebook e Google Ads
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Facebook Ads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Importe leads diretamente do Facebook Ads para o seu CRM
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Conectar Facebook
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Google Ads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Sincronize campanhas do Google Ads com seus leads
            </p>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
              Conectar Google
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdsIntegrationPage;
