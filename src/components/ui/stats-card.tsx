
import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "dashboard-card transition-all duration-300 hover:shadow-md dark:hover:shadow-none",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</p>
        </div>
        {icon && <div>{icon}</div>}
      </div>

      {trend && (
        <div className="mt-2 flex items-center">
          <span
            className={cn(
              "text-xs font-medium flex items-center mr-1",
              trend.positive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {trend.positive ? (
              <ArrowUp size={14} className="mr-0.5" />
            ) : (
              <ArrowDown size={14} className="mr-0.5" />
            )}
            {trend.value}%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
