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
      case 'CRITICAL': return 'bg-rose-50 border-rose-200 text-rose-600';
      case 'HIGH': return 'bg-orange-50 border-orange-200 text-orange-600';
      case 'MEDIUM': return 'bg-amber-50 border-amber-200 text-amber-600';
      default: return 'bg-emerald-50 border-emerald-200 text-emerald-600';
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
      className={`glass-panel rounded-xl overflow-hidden border transition-all duration-300 bg-white ${
        isSelected 
          ? 'ring-2 ring-[#2E7D32] border-[#2E7D32] shadow-md scale-[1.01]' 
          : 'border-[#E5EDE8] hover:border-[#CCDCD1] hover:shadow-sm'
      }`}
    >
      {/* Visual Image Header */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        {report.imageUrl ? (
          <img 
            src={report.imageUrl} 
            alt={report.title} 
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#FAFAF8] to-[#E5EDE8] p-4 text-[#6B7280] text-center">
            <ShieldAlert className="h-10 w-10 text-[#CCDCD1] mb-2" />
            <span className="text-xs font-medium">No Incident Photograph Uploaded</span>
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
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 border border-[#CCDCD1] px-2.5 py-0.5 text-[9px] font-bold text-[#2E7D32] backdrop-blur-sm shadow-sm">
            <Brain className="h-3 w-3" />
            <span>AI Verified ({(report.aiConfidence * 100).toFixed(0)}%)</span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-5 space-y-3">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2E7D32]">
            {typeInfo?.label || report.wasteType.replace('_', ' ')}
          </span>
          <h4 className="text-base font-bold text-[#1F2937] leading-snug line-clamp-1">{report.title}</h4>
        </div>

        <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
          {report.description}
        </p>

        {/* Metadata Details */}
        <div className="pt-2 border-t border-[#F5F7F5] space-y-1.5 text-[11px] text-[#6B7280]">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#2E7D32] shrink-0" />
            <span className="truncate">{report.address}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#2E7D32] shrink-0" />
            <span>Logged on {formatDate(report.createdAt)}</span>
          </div>
        </div>

        {/* Action Button */}
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(report)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#E8F5E9] hover:bg-[#D0E7D2] border border-[#CCDCD1] px-4 py-2 text-xs font-semibold text-[#2E7D32] transition-all hover:gap-2 active:scale-[0.98] mt-3"
          >
            <span>Review Incident Report</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
