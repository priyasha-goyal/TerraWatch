import React from 'react';
import type { Report } from '../../types';
import { STATUS_DETAILS, WASTE_TYPE_DETAILS } from '../../constants/status';
import { MapPin, Calendar, Brain, ArrowRight, ShieldAlert } from 'lucide-react';

interface ReportCardProps {
  report: Report;
  onViewDetails?: (report: Report) => void;
  isSelected?: boolean;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onViewDetails, isSelected }) => {
  const statusInfo = STATUS_DETAILS[report.status];
  const typeInfo = WASTE_TYPE_DETAILS[report.wasteType];

  const getSeverityBadgeClass = (severity: Report['severity']) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
      case 'HIGH': return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
      case 'MEDIUM': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      default: return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      className={`glass-panel rounded-xl overflow-hidden border transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-emerald-500 border-emerald-500 bg-slate-900/90 shadow-2xl scale-[1.01]' 
          : 'border-forest-900/30 hover:border-forest-700/50 hover:bg-slate-900/75'
      }`}
    >
      {/* Visual Image Header */}
      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
        {report.imageUrl ? (
          <img 
            src={report.imageUrl} 
            alt={report.title} 
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-forest-950/40 p-4 text-slate-500 text-center">
            <ShieldAlert className="h-10 w-10 text-forest-800 mb-2" />
            <span className="text-xs">No Incident Photograph Uploaded</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
            getSeverityBadgeClass(report.severity)
          }`}>
            {report.severity}
          </span>
          
          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${
            statusInfo.badgeClass
          }`}>
            {statusInfo.label}
          </span>
        </div>

        {/* AI detection pill if present */}
        {report.aiConfidence !== undefined && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-slate-950/80 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400 backdrop-blur-sm">
            <Brain className="h-3 w-3" />
            <span>AI Verified ({(report.aiConfidence * 100).toFixed(0)}%)</span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-5 space-y-3">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
            {typeInfo?.label || report.wasteType.replace('_', ' ')}
          </span>
          <h4 className="text-base font-bold text-white leading-snug line-clamp-1">{report.title}</h4>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {report.description}
        </p>

        {/* Metadata Details */}
        <div className="pt-2 border-t border-slate-900/50 space-y-1.5 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-forest-500 shrink-0" />
            <span className="truncate">{report.address}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-forest-500 shrink-0" />
            <span>Logged on {formatDate(report.createdAt)}</span>
          </div>
        </div>

        {/* Action Button */}
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(report)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400 transition-all hover:gap-2 active:scale-[0.98] mt-3"
          >
            <span>Review Incident Report</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
