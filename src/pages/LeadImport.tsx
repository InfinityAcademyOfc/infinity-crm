import React from "react";
import { Users, FileText, FileSpreadsheet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeadImportTab from "@/components/import/LeadImportTab";
import DocumentsImportTab from "@/components/import/DocumentsImportTab";
import DataImportTab from "@/components/import/DataImportTab";
const LeadImport = () => {
  const handleDownloadTemplate = () => {
    console.log("Download template");
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log("File uploaded:", e.target.files[0]);
    }
  };
  const handleImport = () => {
    console.log("Import data");
  };
  return <div className="space-y-6">
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
          <TabsTrigger value="data" className="flex items-center gap-1">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Planilhas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          <LeadImportTab onDownloadTemplate={handleDownloadTemplate} onFileUpload={handleFileUpload} onImport={handleImport} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <DocumentsImportTab />
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <DataImportTab />
        </TabsContent>
      </Tabs>
    </div>;
};
export default LeadImport;