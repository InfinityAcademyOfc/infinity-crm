
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { leadService } from "@/services/api/leadService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const LeadImport = () => {
  const { user, companyProfile } = useAuth();
  const queryClient = useQueryClient();
  const [importing, setImporting] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const companyId = companyProfile?.company_id || user?.id || "";

  const parseCSV = (content: string) => {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const lead: any = { company_id: companyId };
      
      headers.forEach((header, index) => {
        const value = values[index]?.replace(/"/g, '');
        
        if (header.includes('nome') || header.includes('name')) {
          lead.name = value;
        } else if (header.includes('email')) {
          lead.email = value;
        } else if (header.includes('telefone') || header.includes('phone')) {
          lead.phone = value;
        } else if (header.includes('descri') || header.includes('description')) {
          lead.description = value;
        } else if (header.includes('valor') || header.includes('value')) {
          lead.value = parseFloat(value) || 0;
        } else if (header.includes('origem') || header.includes('source')) {
          lead.source = value;
        } else if (header.includes('prioridade') || header.includes('priority')) {
          lead.priority = value || 'medium';
        }
      });
      
      return lead;
    }).filter(lead => lead.name); // Only keep leads with names
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const leads = parseCSV(content);
        setPreviewData(leads);
        toast.success(`${leads.length} leads processados. Revise antes de importar.`);
      } catch (error) {
        toast.error('Erro ao processar arquivo CSV');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (previewData.length === 0) {
      toast.error("Nenhum dado para importar");
      return;
    }

    setImporting(true);
    let successful = 0;
    let errors = 0;

    try {
      for (const leadData of previewData) {
        try {
          await leadService.createLead(leadData);
          successful++;
        } catch (error) {
          errors++;
        }
      }

      if (successful > 0) {
        toast.success(`${successful} leads importados com sucesso!`);
        queryClient.invalidateQueries({ queryKey: ['leads', companyId] });
      }
      
      if (errors > 0) {
        toast.error(`${errors} erros durante a importação`);
      }

      setPreviewData([]);
    } catch (error) {
      toast.error('Erro durante a importação');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = "nome,email,telefone,descricao,valor,origem,prioridade\n" +
                    "João Silva,joao@email.com,11999999999,Lead interessado,5000,Site,alta\n" +
                    "Maria Santos,maria@email.com,11888888888,Potencial cliente,3000,Indicação,media";
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Importação de Leads</h1>
        <p className="text-muted-foreground">
          Importe leads em lote usando arquivos CSV
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Importar Leads</CardTitle>
            <CardDescription>
              Selecione um arquivo CSV com seus leads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="file">Arquivo CSV</Label>
              <Input
                id="file"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={importing}
              />
            </div>

            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar Template CSV
            </Button>

            {previewData.length > 0 && (
              <Button
                onClick={handleImport}
                disabled={importing}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                {importing ? "Importando..." : `Importar ${previewData.length} Leads`}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campos Suportados</CardTitle>
            <CardDescription>
              Formato esperado no arquivo CSV
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><strong>nome*</strong> - Nome do lead (obrigatório)</div>
              <div><strong>email</strong> - Endereço de email</div>
              <div><strong>telefone</strong> - Número de telefone</div>
              <div><strong>descricao</strong> - Descrição do lead</div>
              <div><strong>valor</strong> - Valor potencial (numérico)</div>
              <div><strong>origem</strong> - Fonte do lead</div>
              <div><strong>prioridade</strong> - baixa, media, alta</div>
            </div>
            
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span>Use vírgulas para separar os campos e primeira linha como cabeçalho</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {previewData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pré-visualização</CardTitle>
            <CardDescription>
              {previewData.length} leads encontrados no arquivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {previewData.slice(0, 10).map((lead, index) => (
                  <div key={index} className="p-2 border rounded text-sm">
                    <div><strong>{lead.name}</strong></div>
                    {lead.email && <div>📧 {lead.email}</div>}
                    {lead.phone && <div>📞 {lead.phone}</div>}
                    {lead.value > 0 && <div>💰 R$ {lead.value.toLocaleString('pt-BR')}</div>}
                  </div>
                ))}
                {previewData.length > 10 && (
                  <div className="text-center text-muted-foreground">
                    ... e mais {previewData.length - 10} leads
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadImport;
