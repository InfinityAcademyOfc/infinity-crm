
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RPieChart, 
  Pie, 
  Cell 
} from "recharts";
import { useEffect, useState } from "react";

interface FunnelAnalyticsProps {
  funnelStageData: { name: string; value: number }[];
  valuePotentialData: { name: string; value: number }[];
}

const COLORS = ['#4361ee', '#7209b7', '#9d4edd', '#3a0ca3', '#4cc9f0'];
const DARK_COLORS = ['#5D72F2', '#8E32CD', '#AE64E7', '#5C27C9', '#65D2F9'];

export const FunnelAnalytics = ({ 
  funnelStageData, 
  valuePotentialData 
}: FunnelAnalyticsProps) => {
  const [isDark, setIsDark] = useState(false);
  const [chartColors, setChartColors] = useState(COLORS);
  
  useEffect(() => {
    // Check if dark mode is active
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
      setChartColors(isDarkMode ? DARK_COLORS : COLORS);
    };
    
    // Check initial state
    checkDarkMode();
    
    // Create a mutation observer to detect class changes on document.documentElement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });
    
    // Start observing document.documentElement for class changes
    observer.observe(document.documentElement, { attributes: true });
    
    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Leads por Etapa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelStageData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDark ? "#444" : "#e5e7eb"} />
                <XAxis type="number" stroke={isDark ? "#ccc" : "#374151"} />
                <YAxis dataKey="name" type="category" width={100} stroke={isDark ? "#ccc" : "#374151"} />
                <Tooltip 
                  formatter={(value) => [`${value} leads`, "Quantidade"]}
                  contentStyle={{ 
                    background: isDark ? '#1f2937' : '#fff', 
                    border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', 
                    borderRadius: '6px', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    color: isDark ? '#f9fafb' : '#111827'
                  }}
                />
                <Bar dataKey="value" fill={chartColors[0]} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Valor Potencial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RPieChart>
                <Pie
                  data={valuePotentialData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {valuePotentialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, "Valor"]}
                  contentStyle={{ 
                    background: isDark ? '#1f2937' : '#fff', 
                    border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', 
                    borderRadius: '6px', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    color: isDark ? '#f9fafb' : '#111827'
                  }}
                />
              </RPieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
