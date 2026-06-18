import React from 'react';
import { STATUS_DETAILS } from '../../constants/status';
import type { ReportStatus } from '../../constants/status';

interface StatusBadgeProps {
  status: ReportStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const details = STATUS_DETAILS[status];

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide backdrop-blur-sm ${
      details?.badgeClass || 'bg-slate-500/10 border-slate-500/30 text-slate-400'
    }`}>
      {details?.label || status}
    </span>
  );
};
