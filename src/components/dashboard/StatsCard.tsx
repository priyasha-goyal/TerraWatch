import React from 'react';
import * as Icons from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  iconName: keyof typeof Icons;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorClass?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  iconName,
  description,
  trend,
  colorClass = 'text-emerald-400'
}) => {
  const Icon = Icons[iconName] as React.ComponentType<{ className?: string }>;

  return (
    <div className="glass-panel glass-panel-hover rounded-xl p-5 space-y-3 bg-white">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">{title}</span>
        <div className={`rounded-lg bg-[#E8F5E9] p-2 border border-[#CCDCD1] ${colorClass}`}>
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl font-black text-[#1F2937] tracking-tight leading-none font-heading">{value}</h3>
        {description && <p className="text-[11px] text-[#6B7280] leading-normal">{description}</p>}
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold pt-1 border-t border-[#F5F7F5]">
          <span className={trend.isPositive ? 'text-[#2E7D32]' : 'text-rose-600'}>
            {trend.value}
          </span>
          <span className="text-[#6B7280]">vs historical baseline</span>
        </div>
      )}
    </div>
  );
};
