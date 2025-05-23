
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

const SettingsPanel = () => {
  return (
    <Card className="h-full">
      <CardContent className="flex flex-col items-center justify-center h-full p-6">
        <Settings size={48} className="text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Configurações do WhatsApp</h3>
        <p className="text-center text-muted-foreground">
          Configure as opções de conexão e comportamento do WhatsApp.
        </p>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;
