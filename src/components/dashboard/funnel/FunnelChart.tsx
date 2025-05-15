
import React from 'react';
import { ResponsiveContainer, FunnelChart as RechartsFunnel, Funnel, Tooltip, LabelList } from 'recharts';
import { type FunnelStage } from '@/hooks/useFunnelData';

interface FunnelChartProps {
  data: FunnelStage[];
  isDark: boolean;
}

const FunnelChart = ({ data, isDark }: FunnelChartProps) => {
  return (
    <div className="h-56 md:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsFunnel>
          <Tooltip 
            formatter={(value, name) => [`${value} itens`, 'Quantidade']}
            contentStyle={{ 
              background: isDark ? '#1f2937' : '#fff',
              border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', 
              borderRadius: '6px', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              color: isDark ? '#f9fafb' : '#111827'
            }}
          />
          <Funnel
            dataKey="value"
            data={data}
            isAnimationActive
          >
            <LabelList
              position="right"
              fill={isDark ? "#f9fafb" : "#111827"}
              stroke="none"
              dataKey="name"
              fontSize={12}
            />
            <LabelList
              position="center"
              fill="#ffffff"
              stroke="none"
              dataKey="value"
              fontSize={14}
              fontWeight="bold"
            />
          </Funnel>
        </RechartsFunnel>
      </ResponsiveContainer>
    </div>
  );
};

export default FunnelChart;
