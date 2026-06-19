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
  
  const getSeverityBadgeClass = (severity: Report['severity']) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-rose-50 border border-rose-200 text-rose-600';
      case 'HIGH': return 'bg-orange-50 border border-orange-200 text-orange-600';
      case 'MEDIUM': return 'bg-amber-50 border border-amber-200 text-amber-600';
      default: return 'bg-emerald-50 border border-emerald-200 text-emerald-600';
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
    <div className="w-full overflow-x-auto rounded-xl border border-[#E5EDE8] bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-xs">
        <thead className="bg-[#FAFAF8] border-b border-[#E5EDE8] text-[#6B7280] font-bold uppercase tracking-wider">
          <tr>
            <th className="py-4 px-6">Incident Details</th>
            <th className="py-4 px-6">Classification</th>
            <th className="py-4 px-6 text-center">Severity</th>
            <th className="py-4 px-6 text-center">Date Logged</th>
            <th className="py-4 px-6 text-center">Status</th>
            <th className="py-4 px-6 text-right">Moderation Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F5F7F5] text-[#374151]">
          {reports.map((report) => (
            <tr key={report.id} className="hover:bg-[#F5F7F5]/60 transition-colors">
              
              {/* Incident Title & Address */}
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#E8F5E9] p-2 border border-[#CCDCD1] shrink-0">
                    <ShieldAlert className="h-4.5 w-4.5 text-[#2E7D32]" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1F2937] block text-sm">{report.title}</span>
                    <span className="text-[10px] text-[#6B7280] block mt-0.5">{report.address}</span>
                  </div>
                </div>
              </td>

              {/* Classification */}
              <td className="py-4 px-6">
                <span className="font-semibold text-[#1F2937] block">
                  {WASTE_TYPE_DETAILS[report.wasteType]?.label || report.wasteType}
                </span>
                {report.aiConfidence !== undefined && (
                  <span className="text-[9px] text-[#2E7D32] font-semibold block mt-0.5">
                    AI Auto-Classified ({(report.aiConfidence * 100).toFixed(0)}%)
                  </span>
                )}
              </td>

              {/* Severity */}
              <td className="py-4 px-6 text-center">
                <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${getSeverityBadgeClass(report.severity)}`}>
                  {report.severity}
                </span>
              </td>

              {/* Date */}
              <td className="py-4 px-6 text-center text-[#6B7280] font-medium">
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
                    className="rounded bg-[#FAFAF8] hover:bg-[#E5EDE8] p-2 text-[#4B5563] hover:text-[#1F2937] transition-colors border border-[#E5EDE8]"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  {/* Flow controls based on active status */}
                  {report.status === REPORT_STATUS.PENDING && (
                    <button
                      onClick={() => onUpdateStatus(report.id, REPORT_STATUS.INVESTIGATING)}
                      className="rounded bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1 text-[10px] font-bold text-blue-600 transition-colors"
                    >
                      Investigate
                    </button>
                  )}

                  {report.status === REPORT_STATUS.INVESTIGATING && (
                    <button
                      onClick={() => onUpdateStatus(report.id, REPORT_STATUS.CLEANUP_SCHEDULED)}
                      className="rounded bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-1 text-[10px] font-bold text-purple-600 transition-colors"
                    >
                      Schedule Cleanup
                    </button>
                  )}

                  {report.status === REPORT_STATUS.CLEANUP_SCHEDULED && (
                    <button
                      onClick={() => onUpdateStatus(report.id, REPORT_STATUS.RESOLVED)}
                      className="rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold text-[#2E7D32] transition-colors flex items-center gap-1"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Resolve
                    </button>
                  )}

                  {report.status !== REPORT_STATUS.RESOLVED && report.status !== REPORT_STATUS.REJECTED && (
                    <button
                      onClick={() => onUpdateStatus(report.id, REPORT_STATUS.REJECTED)}
                      title="Reject Report"
                      className="rounded bg-rose-50 hover:bg-rose-100 border border-rose-200 p-2 text-rose-600 hover:text-rose-700 transition-colors"
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
              <td colSpan={6} className="py-8 text-center text-[#9CA3AF]">
                No incident reports currently queued.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
