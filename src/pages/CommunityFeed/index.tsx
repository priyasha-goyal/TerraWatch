import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { reportsServiceShell } from '../../services/reports';
import { upvotesService } from '../../services/upvotes';
import { UpvoteButton } from '../../components/reports/UpvoteButton';
import { PageHeader } from '../../components/common/PageHeader';
import { STATUS_DETAILS } from '../../constants/status';
import type { ReportWithUpvotes } from '../../types';
import { MapPin, User, ShieldAlert, SlidersHorizontal } from 'lucide-react';

const severityClass: Record<string, string> = {
  CRITICAL: 'bg-rose-50 border-rose-200 text-rose-600',
  HIGH: 'bg-orange-50 border-orange-200 text-orange-600',
  MEDIUM: 'bg-amber-50 border-amber-200 text-amber-600',
  LOW: 'bg-emerald-50 border-emerald-200 text-emerald-600',
};

type SortOption = 'LATEST' | 'MOST_VALIDATED';

export const CommunityFeedPage: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportWithUpvotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('LATEST');

  useEffect(() => {
    const loadFeed = async () => {
      setLoading(true);
      try {
        const fetchedReports = await reportsServiceShell.getReports();
        const upvoteMap = await upvotesService.batchFetchUpvotes(user?.id ?? null);

        const mapped: ReportWithUpvotes[] = fetchedReports.map((r) => {
          const upvoteData = upvoteMap.get(r.id) || { count: 0, hasUpvoted: false };
          return {
            ...r,
            upvoteCount: upvoteData.count,
            hasUpvoted: upvoteData.hasUpvoted,
          };
        });

        setReports(mapped);
      } catch (err) {
        console.error('Error loading community feed:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, [user]);

  const sortedReports = [...reports].sort((a, b) => {
    if (sortBy === 'MOST_VALIDATED') {
      if (b.upvoteCount !== a.upvoteCount) {
        return b.upvoteCount - a.upvoteCount;
      }
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Community Validation Feed"
        description="Verify and upvote reported ecological incidents in your area. Community validations help prioritize municipal intervention."
      />

      {/* Sorting panel */}
      <div className="flex items-center justify-between border-b border-[#E5EDE8] pb-4">
        <span className="text-xs text-slate-500 font-semibold">
          Showing {sortedReports.length} incidents
        </span>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
          <span className="text-xs text-slate-600 font-bold mr-1">Sort:</span>
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
            <button
              onClick={() => setSortBy('LATEST')}
              className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                sortBy === 'LATEST'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setSortBy('MOST_VALIDATED')}
              className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                sortBy === 'MOST_VALIDATED'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Most Validated
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white h-80 animate-pulse" />
          ))}
        </div>
      ) : sortedReports.length === 0 ? (
        <div className="rounded-2xl border border-[#E5EDE8] bg-white p-12 text-center space-y-4 shadow-sm max-w-md mx-auto my-12">
          <ShieldAlert className="h-12 w-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-[#1F2937]">No validation incidents</h4>
            <p className="text-xs text-[#6B7280]">
              There are no active environmental incident reports to validate at this time.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedReports.map((report) => {
            const statusInfo = STATUS_DETAILS[report.status];
            return (
              <div
                key={report.id}
                className="rounded-2xl overflow-hidden border border-slate-200 bg-white transition-all duration-205 hover:shadow-md flex flex-col justify-between"
              >
                {/* Image strip */}
                <div className="relative h-44 w-full bg-slate-50 overflow-hidden border-b border-slate-100">
                  {report.imageUrl ? (
                    <img
                      src={report.imageUrl}
                      alt={report.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#FAFAF8] to-[#E5EDE8] text-[#6B7280] text-center p-4">
                      <ShieldAlert className="h-8 w-8 text-[#CCDCD1] mb-1.5" />
                      <span className="text-[11px] font-medium">No photograph uploaded</span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                        severityClass[report.severity] || 'bg-slate-50 text-slate-600'
                      }`}
                    >
                      {report.severity}
                    </span>
                    {statusInfo && (
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm ${statusInfo.badgeClass}`}
                      >
                        {statusInfo.label}
                      </span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-[#1F2937] leading-snug line-clamp-1">
                      {report.title}
                    </h4>
                    <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-slate-100 text-[11px] text-[#6B7280]">
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>📍 {report.latitude}, {report.longitude}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <User className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>🕵️ Anonymous Reporter</span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-4 border-t border-slate-100 flex justify-center">
                    <UpvoteButton
                      reportId={report.id}
                      initialCount={report.upvoteCount}
                      initialHasUpvoted={report.hasUpvoted}
                      disabled={!user}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
