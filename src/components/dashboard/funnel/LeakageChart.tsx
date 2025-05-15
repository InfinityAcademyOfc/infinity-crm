
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';
import { type FunnelStage } from '@/hooks/useFunnelData';

interface LeakageChartProps {
  data: FunnelStage[];
  isDark: boolean;
  color: string;
}

const LeakageChart = ({ data, isDark, color }: LeakageChartProps) => {
  return (
    <div className="h-56 md:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDark ? "#444" : "#e5e7eb"} />
          <XAxis 
            type="number" 
            domain={[0, 50]} 
            tick={{fontSize: 12}} 
            stroke={isDark ? "#ccc" : "#374151"}
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={60} 
            tick={{fontSize: 12}} 
            stroke={isDark ? "#ccc" : "#374151"}
          />
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Fugas']}
            contentStyle={{ 
              background: isDark ? '#1f2937' : '#fff',
              border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', 
              borderRadius: '6px', 
              color: isDark ? '#f9fafb' : '#111827'
            }}
          />
          <Bar dataKey="leakage" fill={color} radius={[0, 4, 4, 0]}>
            <LabelList dataKey="leakage" position="right" formatter={(value) => `${value}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeakageChart;
