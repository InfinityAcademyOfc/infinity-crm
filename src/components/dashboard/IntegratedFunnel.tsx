
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip } from "recharts";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Mock data for the funnel chart
const data = [
  {
    name: "Visitantes",
    value: 5000,
  },
  {
    name: "Leads",
    value: 2500,
  },
  {
    name: "Oportunidades",
    value: 1250,
  },
  {
    name: "Propostas",
    value: 640,
  },
  {
    name: "Fechamentos",
    value: 320,
  },
];

// Custom color gradient for the funnel
const COLORS = ["#4361ee", "#3a57d8", "#314bc2", "#283fac", "#1f3396"];

const IntegratedFunnel = () => {
  const { toast } = useToast();
  
  const handleExport = () => {
    // Prepare CSV content
    const headers = ["Etapa", "Quantidade"];
    const rows = data.map(item => [
      item.name,
      item.value
    ]);
    
    // Calculate conversion rates
    const conversionRates = [];
    for (let i = 1; i < data.length; i++) {
      const rate = ((data[i].value / data[i-1].value) * 100).toFixed(2);
      conversionRates.push([`${data[i-1].name} → ${data[i].name}`, `${rate}%`]);
    }
    
    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(",")),
      "",
      ["Conversão entre etapas", "Taxa"],
      ...conversionRates.map(row => row.join(","))
    ].join("\n");
    
    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `funil-integrado-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída",
      description: "Os dados do funil integrado foram exportados em formato CSV",
      duration: 2000 // Reduced to 2 seconds
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Funil de Conversão</CardTitle>
          <CardDescription>Jornada do cliente até a conversão</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
          <Download size={16} />
          Exportar CSV
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip 
                formatter={(value) => [`${value} leads`, ""]}
                contentStyle={{ 
                  background: 'var(--background)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '6px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }}
              />
              <Funnel
                dataKey="value"
                data={data}
                isAnimationActive
                nameKey="name"
                fill="#4361ee"
              >
                <LabelList 
                  position="right" 
                  fill="#888" 
                  stroke="none" 
                  dataKey="name" 
                  fontSize={12}
                />
                <LabelList 
                  position="right" 
                  fill="#888" 
                  stroke="none" 
                  dataKey="value" 
                  fontSize={12}
                  formatter={(value: number) => `${value} leads`}
                  offset={40}
                />
                {data.map((entry, index) => (
                  <Funnel
                    key={`funnel-${index}`}
                    dataKey="value"
                    fill={COLORS[index % COLORS.length]}
                    stroke="none"
                  />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegratedFunnel;
