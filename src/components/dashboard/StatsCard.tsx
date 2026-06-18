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
    <div className="glass-panel glass-panel-hover rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
        <div className={`rounded-lg bg-slate-950 p-2 border border-forest-900/30 ${colorClass}`}>
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl font-black text-white tracking-tight leading-none font-heading">{value}</h3>
        {description && <p className="text-[11px] text-slate-400 leading-normal">{description}</p>}
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold pt-1 border-t border-slate-900/50">
          <span className={trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}>
            {trend.value}
          </span>
          <span className="text-slate-500">vs historical baseline</span>
        </div>
      )}
    </div>
  );
};
