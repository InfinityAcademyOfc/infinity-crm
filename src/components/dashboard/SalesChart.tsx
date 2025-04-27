
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3, Filter, Download } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface SalesChartProps {
  data: Array<{
    month: string;
    value: number;
  }>;
  onPeriodChange: (period: string) => void;
  onCollaboratorChange: (collaborator: string) => void;
  onProductChange: (product: string) => void;
  filterPeriod: string;
  filterCollaborator: string;
  filterProduct: string;
}

const SalesChart = ({ 
  data, 
  onPeriodChange, 
  onCollaboratorChange,
  onProductChange,
  filterPeriod,
  filterCollaborator,
  filterProduct
}: SalesChartProps) => {
  const { toast } = useToast();
  
  const handleExport = () => {
    // Prepare export data based on current filters
    const exportData = {
      periodo: filterPeriod === "3" ? "Últimos 3 meses" : 
              filterPeriod === "6" ? "Últimos 6 meses" : "Últimos 12 meses",
      colaborador: filterCollaborator === "all" ? "Todos" : 
                  filterCollaborator === "user1" ? "Carlos Silva" : "Ana Oliveira",
      produto: filterProduct === "all" ? "Todos" : 
              filterProduct === "product1" ? "Marketing Digital" : "Consultoria",
      dados: data,
      totalVendas: data.reduce((sum, item) => sum + item.value, 0),
      dataExportacao: new Date().toISOString()
    };
    
    // Create and download JSON file
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendas-${filterPeriod}m-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: `Exportação concluída`,
      description: `Os dados de vendas foram exportados com sucesso.`,
    });
  };
  
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Vendas por Mês</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={handleExport}
          >
            <Download size={16} />
            Exportar
          </Button>
        </div>
        <CardDescription>Performance de vendas nos últimos períodos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium">Filtrar:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={filterPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Período</SelectLabel>
                  <SelectItem value="3">Últimos 3 meses</SelectItem>
                  <SelectItem value="6">Últimos 6 meses</SelectItem>
                  <SelectItem value="12">Últimos 12 meses</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Select value={filterCollaborator} onValueChange={onCollaboratorChange}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue placeholder="Colaborador" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Colaborador</SelectLabel>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="user1">Carlos Silva</SelectItem>
                  <SelectItem value="user2">Ana Oliveira</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Select value={filterProduct} onValueChange={onProductChange}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue placeholder="Produto" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Produto</SelectLabel>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="product1">Marketing Digital</SelectItem>
                  <SelectItem value="product2">Consultoria</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} />
              <YAxis tickFormatter={(value) => `R$${value/1000}k`} tickLine={false} axisLine={false} />
              <Tooltip 
                formatter={(value) => [formatCurrency(Number(value)), "Vendas"]}
                contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="value" fill="#4361ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="text-xs text-muted-foreground">
          {data.length === 0 ? (
            "Nenhum dado encontrado para os filtros selecionados"
          ) : (
            `Exibindo ${data.length} ${data.length === 1 ? 'período' : 'períodos'}`
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SalesChart;
