
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, List, LayoutPanelTop, GitBranch } from "lucide-react";

interface TeamViewTabsProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const TeamViewTabs: React.FC<TeamViewTabsProps> = ({
  activeView,
  onViewChange
}) => {
  return (
    <TabsList>
      <TabsTrigger value="grid">
        <Grid className="h-4 w-4 mr-2" />
        Cards
      </TabsTrigger>
      <TabsTrigger value="table">
        <List className="h-4 w-4 mr-2" />
        Tabela
      </TabsTrigger>
      <TabsTrigger value="org">
        <LayoutPanelTop className="h-4 w-4 mr-2" />
        Organograma
      </TabsTrigger>
      <TabsTrigger value="hierarchy">
        <GitBranch className="h-4 w-4 mr-2" />
        Hierarquia
      </TabsTrigger>
    </TabsList>
  );
};
