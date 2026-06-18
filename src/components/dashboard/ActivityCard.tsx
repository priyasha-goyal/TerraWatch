import React from 'react';
import { ShieldAlert, Users, Coins, Calendar, Trash2 } from 'lucide-react';

export interface ActivityItem {
  id: string;
  type: 'REPORT' | 'CLEANUP' | 'ECOCOIN';
  title: string;
  subtitle: string;
  timestamp: string;
  value?: string;
}

interface ActivityCardProps {
  activities: ActivityItem[];
  title?: string;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activities, 
  title = 'Recent Platform Activities' 
}) => {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'REPORT':
        return <ShieldAlert className="h-4 w-4 text-orange-400" />;
      case 'CLEANUP':
        return <Users className="h-4 w-4 text-emerald-400" />;
      case 'ECOCOIN':
        return <Coins className="h-4 w-4 text-yellow-400 animate-pulse" />;
      default:
        return <Trash2 className="h-4 w-4 text-slate-400" />;
    }
  };

  const formatRelativeTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="glass-panel rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-forest-900/10 pb-2">
        {title}
      </h3>

      <div className="divide-y divide-slate-900/50 space-y-3.5">
        {activities.map((act) => (
          <div key={act.id} className="flex items-start justify-between gap-4 pt-3.5 first:pt-0">
            <div className="flex gap-3">
              <div className="rounded-lg bg-slate-950 p-2 border border-forest-900/30 shrink-0">
                {getActivityIcon(act.type)}
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-white leading-normal">{act.title}</p>
                <p className="text-[10px] text-slate-400">{act.subtitle}</p>
                <div className="flex items-center gap-1 text-[9px] text-slate-500 pt-0.5">
                  <Calendar className="h-3 w-3" />
                  <span>{formatRelativeTime(act.timestamp)}</span>
                </div>
              </div>
            </div>

            {act.value && (
              <span className="text-xs font-bold text-slate-300 bg-slate-950/60 border border-slate-900 px-2 py-0.5 rounded">
                {act.value}
              </span>
            )}
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-6 text-xs text-slate-500">
            No active registrations logged recently.
          </div>
        )}
      </div>
    </div>
  );
};
