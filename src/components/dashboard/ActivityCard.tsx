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
        return <ShieldAlert className="h-4 w-4 text-orange-600" />;
      case 'CLEANUP':
        return <Users className="h-4 w-4 text-[#2E7D32]" />;
      case 'ECOCOIN':
        return <Coins className="h-4 w-4 text-amber-500 animate-pulse" />;
      default:
        return <Trash2 className="h-4 w-4 text-[#6B7280]" />;
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
    <div className="glass-panel rounded-xl p-5 space-y-4 bg-white">
      <h3 className="text-sm font-bold uppercase tracking-wider text-[#1F2937] border-b border-[#E5EDE8] pb-2">
        {title}
      </h3>

      <div className="divide-y divide-[#F5F7F5] space-y-3.5">
        {activities.map((act) => (
          <div key={act.id} className="flex items-start justify-between gap-4 pt-3.5 first:pt-0">
            <div className="flex gap-3">
              <div className="rounded-lg bg-[#FAFAF8] p-2 border border-[#E5EDE8] shrink-0">
                {getActivityIcon(act.type)}
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-[#1F2937] leading-normal">{act.title}</p>
                <p className="text-[10px] text-[#6B7280]">{act.subtitle}</p>
                <div className="flex items-center gap-1 text-[9px] text-[#9CA3AF] pt-0.5">
                  <Calendar className="h-3 w-3" />
                  <span>{formatRelativeTime(act.timestamp)}</span>
                </div>
              </div>
            </div>

            {act.value && (
              <span className="text-xs font-bold text-[#374151] bg-[#FAFAF8] border border-[#E5EDE8] px-2 py-0.5 rounded">
                {act.value}
              </span>
            )}
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-6 text-xs text-[#9CA3AF]">
            No active registrations logged recently.
          </div>
        )}
      </div>
    </div>
  );
};
