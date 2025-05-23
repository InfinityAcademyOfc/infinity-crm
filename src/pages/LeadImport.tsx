
import React from "react";
import { Users, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeadImportTab from "@/components/import/LeadImportTab";
import DocumentsImportTab from "@/components/import/DocumentsImportTab";

const LeadImport = () => {
  const handleDownloadTemplate = () => {
    // Create CSV template for leads
    const csvContent = "data:text/csv;charset=utf-8,Nome,Email,Telefone,Empresa,Valor,Fonte,Status\nJoão Silva,joao@exemplo.com,(11) 99999-9999,Empresa ABC,5000,Website,new";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "template-leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log("File uploaded:", e.target.files[0]);
    }
  };

  const handleImport = () => {
    console.log("Import data");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground shadow-sm">
          <TabsTrigger value="leads" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Leads</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Documentos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          <LeadImportTab 
            onDownloadTemplate={handleDownloadTemplate} 
            onFileUpload={handleFileUpload} 
            onImport={handleImport} 
          />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <DocumentsImportTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadImport;
