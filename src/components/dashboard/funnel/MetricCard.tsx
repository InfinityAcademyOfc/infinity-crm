
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

const MetricCard = ({ icon: Icon, label, value, bgClass, borderClass, textClass }: MetricCardProps) => {
  return (
    <div className={`flex flex-col items-center justify-center rounded-lg p-2 ${bgClass} ${borderClass} shadow-sm`}>
      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <Icon className="h-3 w-3" />
        <span>{label}</span>
      </div>
      <p className={`text-lg font-bold ${textClass}`}>
        {value}
      </p>
    </div>
  );
};

export default MetricCard;
