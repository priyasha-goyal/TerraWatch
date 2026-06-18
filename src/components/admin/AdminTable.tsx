import React from 'react';
import type { Report } from '../../types';
import { StatusBadge } from './StatusBadge';
import { REPORT_STATUS, type ReportStatus, WASTE_TYPE_DETAILS } from '../../constants/status';
import { Check, Trash2, Eye, ShieldAlert } from 'lucide-react';

interface AdminTableProps {
  reports: Report[];
  onUpdateStatus: (reportId: string, status: ReportStatus) => void;
  onSelectReport: (report: Report) => void;
}

export const AdminTable: React.FC<AdminTableProps> = ({
  reports,
  onUpdateStatus,
  onSelectReport
}) => {
  
  const getSeverityTextColor = (severity: Report['severity']) => {
    switch (severity) {
      case 'CRITICAL': return 'text-rose-400 font-bold';
      case 'HIGH': return 'text-orange-400 font-semibold';
      case 'MEDIUM': return 'text-amber-400 font-medium';
      default: return 'text-emerald-400';
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
    <div className="w-full overflow-x-auto rounded-xl border border-forest-900/40 bg-slate-900/40">
      <table className="w-full border-collapse text-left text-xs">
        <thead className="bg-slate-900 border-b border-forest-900/30 text-slate-400 font-bold uppercase tracking-wider">
          <tr>
            <th className="py-4 px-6">Incident Details</th>
            <th className="py-4 px-6">Classification</th>
            <th className="py-4 px-6 text-center">Severity</th>
            <th className="py-4 px-6 text-center">Date Logged</th>
            <th className="py-4 px-6 text-center">Status</th>
            <th className="py-4 px-6 text-right">Moderation Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50 text-slate-300">
          {reports.map((report) => (
            <tr key={report.id} className="hover:bg-slate-900/40 transition-colors">
              
              {/* Incident Title & Address */}
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-950 p-2 border border-forest-900/20 shrink-0">
                    <ShieldAlert className="h-4.5 w-4.5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">{report.title}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{report.address}</span>
                  </div>
                </div>
              </td>

              {/* Classification */}
              <td className="py-4 px-6">
                <span className="font-semibold text-slate-300 block">
                  {WASTE_TYPE_DETAILS[report.wasteType]?.label || report.wasteType}
                </span>
                {report.aiConfidence !== undefined && (
                  <span className="text-[9px] text-emerald-400 font-medium">
                    AI Auto-Classified ({(report.aiConfidence * 100).toFixed(0)}%)
                  </span>
                )}
              </td>

              {/* Severity */}
              <td className="py-4 px-6 text-center">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-950 ${getSeverityTextColor(report.severity)}`}>
                  {report.severity}
                </span>
              </td>

              {/* Date */}
              <td className="py-4 px-6 text-center text-slate-400 font-medium">
                {formatDate(report.createdAt)}
              </td>

              {/* Status */}
              <td className="py-4 px-6 text-center">
                <StatusBadge status={report.status} />
              </td>

              {/* Actions */}
              <td className="py-4 px-6">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onSelectReport(report)}
                    title="View Details"
                    className="rounded bg-slate-950 hover:bg-slate-850 p-2 text-slate-400 hover:text-white transition-colors border border-forest-900/20"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  {/* Flow controls based on active status */}
                  {report.status === REPORT_STATUS.PENDING && (
                    <button
                      onClick={() => onUpdateStatus(report.id, REPORT_STATUS.INVESTIGATING)}
                      className="rounded bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-2 py-1 text-[10px] font-bold text-blue-400 transition-colors"
                    >
                      Investigate
                    </button>
                  )}

                  {report.status === REPORT_STATUS.INVESTIGATING && (
                    <button
                      onClick={() => onUpdateStatus(report.id, REPORT_STATUS.CLEANUP_SCHEDULED)}
                      className="rounded bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 px-2 py-1 text-[10px] font-bold text-purple-400 transition-colors"
                    >
                      Schedule Cleanup
                    </button>
                  )}

                  {report.status === REPORT_STATUS.CLEANUP_SCHEDULED && (
                    <button
                      onClick={() => onUpdateStatus(report.id, REPORT_STATUS.RESOLVED)}
                      className="rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-400 transition-colors flex items-center gap-1"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Resolve
                    </button>
                  )}

                  {report.status !== REPORT_STATUS.RESOLVED && report.status !== REPORT_STATUS.REJECTED && (
                    <button
                      onClick={() => onUpdateStatus(report.id, REPORT_STATUS.REJECTED)}
                      title="Reject Report"
                      className="rounded bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 p-2 text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>

            </tr>
          ))}

          {reports.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-slate-500">
                No incident reports currently queued.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
