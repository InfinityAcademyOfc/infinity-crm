
import React from "react";
import { Users, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/ui/section-header";
import LeadImportTab from "@/components/import/LeadImportTab";
import DocumentsImportTab from "@/components/import/DocumentsImportTab";

const LeadImport = () => {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Importação de Dados" 
        description="Importe leads e documentos para o sistema"
      />
      
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

        <TabsContent value="leads">
          <LeadImportTab />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsImportTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadImport;
