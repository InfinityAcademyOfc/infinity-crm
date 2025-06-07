
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImportedLead } from '@/services/importService';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface LeadImportPreviewProps {
  leads: ImportedLead[];
  isImporting: boolean;
  onImport: () => void;
  onClear: () => void;
}

const LeadImportPreview: React.FC<LeadImportPreviewProps> = ({
  leads,
  isImporting,
  onImport,
  onClear
}) => {
  if (leads.length === 0) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Prévia da Importação
        </CardTitle>
        <CardDescription>
          {leads.length} leads prontos para importação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-40 overflow-y-auto space-y-2">
          {leads.slice(0, 5).map((lead, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded">
              <div>
                <span className="font-medium">{lead.name}</span>
                {lead.email && (
                  <span className="text-sm text-muted-foreground ml-2">
                    {lead.email}
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                {lead.value && (
                  <Badge variant="secondary">
                    R$ {lead.value.toLocaleString()}
                  </Badge>
                )}
                <Badge variant="outline">
                  {lead.priority || 'medium'}
                </Badge>
              </div>
            </div>
          ))}
          {leads.length > 5 && (
            <div className="text-center text-sm text-muted-foreground">
              + {leads.length - 5} leads adicionais
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={onImport}
            disabled={isImporting}
            className="flex-1"
          >
            {isImporting ? 'Importando...' : `Importar ${leads.length} Leads`}
          </Button>
          <Button 
            variant="outline" 
            onClick={onClear}
            disabled={isImporting}
          >
            Cancelar
          </Button>
        </div>

        {leads.some(lead => !lead.email) && (
          <div className="flex items-center gap-2 text-sm text-yellow-600">
            <AlertCircle className="h-4 w-4" />
            Alguns leads não possuem email
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadImportPreview;
