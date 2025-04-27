
import { Button } from "@/components/ui/button";
import { Filter, Download, Plus, BarChart2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface FunnelHeaderProps {
  showAnalytics: boolean;
  setShowAnalytics: (show: boolean) => void;
  filterMenuOpen: boolean;
  setFilterMenuOpen: (open: boolean) => void;
  onAddNewLead: () => void;
}

export function FunnelHeader({ 
  showAnalytics, 
  setShowAnalytics, 
  filterMenuOpen, 
  setFilterMenuOpen,
  onAddNewLead 
}: FunnelHeaderProps) {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [vendedor, setVendedor] = useState("todos");
  const [produto, setProduto] = useState("todos");
  const [periodo, setPeriodo] = useState("mes");
  const [dataInicio, setDataInicio] = useState<Date | undefined>(
    new Date(new Date().setDate(1)) // First day of current month
  );
  const [dataFim, setDataFim] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  
  const handleFilter = () => {
    setFilterDialogOpen(false);
    toast({
      title: "Filtros aplicados",
      description: `Filtros: ${vendedor !== "todos" ? `Vendedor: ${vendedor}, ` : ""}${produto !== "todos" ? `Produto: ${produto}, ` : ""}Período: ${dataInicio ? format(dataInicio, "dd/MM/yyyy") : ""} até ${dataFim ? format(dataFim, "dd/MM/yyyy") : ""}`,
    });
  };
  
  const handleExport = () => {
    setExportDialogOpen(false);
    
    // Simulação de exportação
    const exportData = {
      filtros: {
        vendedor: vendedor !== "todos" ? vendedor : "Todos",
        produto: produto !== "todos" ? produto : "Todos",
        periodo: periodo,
        dataInicio: dataInicio ? format(dataInicio, "yyyy-MM-dd") : null,
        dataFim: dataFim ? format(dataFim, "yyyy-MM-dd") : null,
      },
      dataExportacao: new Date().toISOString()
    };
    
    // Create file and trigger download
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `funil-vendas-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exportação concluída",
      description: "Os dados do funil de vendas foram exportados com sucesso.",
    });
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-2 p-2 bg-card/80 dark:bg-gray-800/40 backdrop-blur-md shadow-md rounded-md">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 flex items-center gap-1"
            onClick={() => setFilterDialogOpen(true)}
          >
            <Filter className="h-4 w-4" />
            <span className="text-xs">Filtrar</span>
          </Button>
          
          <Button 
            variant={showAnalytics ? "default" : "outline"}
            size="sm" 
            className="h-8 flex items-center gap-1"
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            <BarChart2 className="h-4 w-4" />
            <span className="text-xs">Analytics</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 flex items-center gap-1"
            onClick={() => setExportDialogOpen(true)}
          >
            <Download className="h-4 w-4" />
            <span className="text-xs">Exportar</span>
          </Button>
        </div>
        
        <Button 
          size="sm" 
          className="h-8 flex items-center gap-1"
          onClick={onAddNewLead}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filtrar Funil</DialogTitle>
            <DialogDescription>
              Defina os filtros para visualização do funil
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="vendedor">Vendedor</Label>
              <Select value={vendedor} onValueChange={setVendedor}>
                <SelectTrigger id="vendedor">
                  <SelectValue placeholder="Selecionar vendedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="carlos">Carlos Silva</SelectItem>
                  <SelectItem value="ana">Ana Oliveira</SelectItem>
                  <SelectItem value="pedro">Pedro Santos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="produto">Produto</Label>
              <Select value={produto} onValueChange={setProduto}>
                <SelectTrigger id="produto">
                  <SelectValue placeholder="Selecionar produto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="crm">CRM</SelectItem>
                  <SelectItem value="marketing">Marketing Digital</SelectItem>
                  <SelectItem value="consultoria">Consultoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="periodo">Período</Label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger id="periodo">
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dia">Diário</SelectItem>
                  <SelectItem value="semana">Semanal</SelectItem>
                  <SelectItem value="mes">Mensal</SelectItem>
                  <SelectItem value="trimestre">Trimestral</SelectItem>
                  <SelectItem value="ano">Anual</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Data inicial</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dataInicio}
                      onSelect={setDataInicio}
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label>Data final</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      {dataFim ? format(dataFim, "dd/MM/yyyy") : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dataFim}
                      onSelect={setDataFim}
                      disabled={(date) => date > new Date() || (dataInicio ? date < dataInicio : false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleFilter}>Aplicar Filtros</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Exportar Dados</DialogTitle>
            <DialogDescription>
              Configure a exportação de dados do funil
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Formato</Label>
              <Select defaultValue="json">
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV (em breve)</SelectItem>
                  <SelectItem value="excel">Excel (em breve)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Incluir no relatório</Label>
              <div className="grid gap-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="incluir-analytics" defaultChecked className="rounded border-gray-300" />
                  <Label htmlFor="incluir-analytics" className="leading-none">Analytics e métricas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="incluir-leads" defaultChecked className="rounded border-gray-300" />
                  <Label htmlFor="incluir-leads" className="leading-none">Dados de leads</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="incluir-historico" defaultChecked className="rounded border-gray-300" />
                  <Label htmlFor="incluir-historico" className="leading-none">Histórico de movimentações</Label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleExport}>Exportar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
