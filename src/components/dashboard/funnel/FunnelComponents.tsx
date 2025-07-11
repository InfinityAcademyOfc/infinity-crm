
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';

interface FunnelStage {
  name: string;
  value: number;
  conversion?: number;
  leakage?: number;
}

interface FunnelData {
  stages: FunnelStage[];
  conversionRate: number;
}

interface FunnelChartProps {
  data: FunnelStage[];
  isDark: boolean;
}

export const FunnelChart: React.FC<FunnelChartProps> = ({ data, isDark }) => {
  const colors = isDark ? ['#60a5fa', '#34d399', '#fbbf24', '#f87171'] : ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  
  return (
    <div className="h-56 md:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="horizontal">
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={80} />
          <Tooltip 
            formatter={(value) => [`${value} itens`, "Quantidade"]}
            contentStyle={{
              background: isDark ? '#1f2937' : '#fff',
              border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
              borderRadius: '6px'
            }}
          />
          <Bar dataKey="value" fill={colors[0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface ConversionChartProps {
  data: FunnelStage[];
  isDark: boolean;
  color: string;
}

export const ConversionChart: React.FC<ConversionChartProps> = ({ data, isDark, color }) => {
  const conversionData = data.map((stage, index) => ({
    name: stage.name,
    conversion: stage.conversion || (index > 0 ? ((stage.value / data[index - 1].value) * 100) : 100)
  }));

  return (
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={conversionData}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip 
            formatter={(value) => [`${Number(value).toFixed(1)}%`, "Conversão"]}
            contentStyle={{
              background: isDark ? '#1f2937' : '#fff',
              border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
              borderRadius: '6px'
            }}
          />
          <Bar dataKey="conversion" fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface LeakageChartProps {
  data: FunnelStage[];
  isDark: boolean;
  color: string;
}

export const LeakageChart: React.FC<LeakageChartProps> = ({ data, isDark, color }) => {
  const leakageData = data.map((stage, index) => ({
    name: stage.name,
    leakage: stage.leakage || (index > 0 ? (100 - ((stage.value / data[index - 1].value) * 100)) : 0)
  }));

  return (
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={leakageData}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip 
            formatter={(value) => [`${Number(value).toFixed(1)}%`, "Fuga"]}
            contentStyle={{
              background: isDark ? '#1f2937' : '#fff',
              border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
              borderRadius: '6px'
            }}
          />
          <Bar dataKey="leakage" fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface FunnelSummaryProps {
  type: 'sales' | 'ltv' | 'production';
  data: FunnelData;
}

export const FunnelSummary: React.FC<FunnelSummaryProps> = ({ type, data }) => {
  const getSummaryInfo = () => {
    switch (type) {
      case 'sales':
        return {
          icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
          label: 'Eficiência',
          value: `${data.conversionRate}%`,
          description: 'Taxa de conversão'
        };
      case 'ltv':
        return {
          icon: <Activity className="h-4 w-4 text-purple-500" />,
          label: 'Valor Médio',
          value: 'R$ 5.200',
          description: 'LTV por cliente'
        };
      case 'production':
        return {
          icon: <TrendingUp className="h-4 w-4 text-cyan-500" />,
          label: 'Produtividade',
          value: `${data.conversionRate}%`,
          description: 'Taxa de entrega'
        };
    }
  };

  const info = getSummaryInfo();

  return (
    <div className="flex items-center justify-center">
      <Badge variant="outline" className="flex items-center gap-2 px-3 py-2">
        {info.icon}
        <div className="text-center">
          <div className="font-semibold text-sm">{info.value}</div>
          <div className="text-xs text-muted-foreground">{info.description}</div>
        </div>
      </Badge>
    </div>
  );
};
