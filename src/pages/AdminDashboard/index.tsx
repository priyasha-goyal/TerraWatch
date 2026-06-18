import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import { PageHeader } from '../../components/common/PageHeader';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { AdminTable } from '../../components/admin/AdminTable';
import type { Report } from '../../types';
import { REPORT_STATUS, type ReportStatus, WASTE_TYPE_DETAILS } from '../../constants/status';
import { Layers } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Redirect if not authorized (MUNICIPALITY or ADMIN roles)
  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }
    if (user.role !== 'ADMIN' && user.role !== 'MUNICIPALITY') {
      navigate(ROUTES.DASHBOARD);
    }
  }, [user, navigate]);

  useEffect(() => {
    // Generate initial reports if not in local storage
    const stored = localStorage.getItem('tw_reports');
    const mockReports: Report[] = [
      {
        id: 'rep-101',
        reporterId: 'usr-google-101',
        reporterName: 'Eco Volunteer',
        title: 'Large pile of plastic bottles near riparian buffer',
        description: 'Over 50 discarded plastic soft drink bottles and packaging materials floating on the shoreline, threatening waterfowl nesting grounds.',
        wasteType: 'PLASTIC',
        severity: 'MEDIUM',
        latitude: 43.64532,
        longitude: -79.37812,
        address: 'High Park South Boardwalk, Toronto, ON',
        imageUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&auto=format&fit=crop&q=80',
        status: 'PENDING',
        aiConfidence: 0.94,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'rep-102',
        reporterId: 'usr-google-101',
        reporterName: 'Eco Volunteer',
        title: 'Toxic battery fluid drums disposed illegally',
        description: 'Two large steel drums containing industrial battery casings and chemical leakage dumped off the trail. Strong solvent odors.',
        wasteType: 'CHEMICAL',
        severity: 'CRITICAL',
        latitude: 43.66782,
        longitude: -79.41245,
        address: 'Ravine Trail Entrance, Cedarvale Park, Toronto, ON',
        imageUrl: 'https://images.unsplash.com/photo-1605600656308-972a4e843af0?w=600&auto=format&fit=crop&q=80',
        status: 'INVESTIGATING',
        aiConfidence: 0.88,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'rep-103',
        reporterId: 'usr-google-202',
        reporterName: 'Sanitation Watcher',
        title: 'Discarded tires and construction concrete dumpsite',
        description: 'Over 20 rubber tires and masonry scrap blocks left under canopy clearing. Prompts soil erosion and blocks turtle nesting trails.',
        wasteType: 'CONSTRUCTION',
        severity: 'HIGH',
        latitude: 43.68231,
        longitude: -79.33256,
        address: 'Don River Valley Woodland, Toronto, ON',
        status: 'RESOLVED',
        aiConfidence: 0.81,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Report[];
        const merged = [...parsed, ...mockReports.filter(mr => !parsed.some(pr => pr.id === mr.id))];
        setReports(merged);
        if (merged.length > 0) setSelectedReport(merged[0]);
      } catch (e) {
        setReports(mockReports);
        setSelectedReport(mockReports[0]);
      }
    } else {
      setReports(mockReports);
      setSelectedReport(mockReports[0]);
      localStorage.setItem('tw_reports', JSON.stringify(mockReports));
    }
  }, []);

  const handleUpdateStatus = (reportId: string, nextStatus: ReportStatus) => {
    const updated = reports.map((rep) => {
      if (rep.id === reportId) {
        const item = { ...rep, status: nextStatus, updatedAt: new Date().toISOString() };
        if (selectedReport?.id === reportId) setSelectedReport(item);
        return item;
      }
      return rep;
    });
    setReports(updated);
    localStorage.setItem('tw_reports', JSON.stringify(updated));

    // Log this status change activity
    const activityList = JSON.parse(localStorage.getItem('tw_activities') || '[]');
    const statusLabel = nextStatus.toLowerCase().replace('_', ' ');
    activityList.unshift({
      id: `act-${Math.random().toString(36).substr(2, 9)}`,
      type: nextStatus === REPORT_STATUS.RESOLVED ? 'CLEANUP' : 'REPORT',
      title: `Status Set: ${statusLabel}`,
      subtitle: `Incident #${reportId} updated by municipal officer`,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('tw_activities', JSON.stringify(activityList));
  };

  if (!user) return null;

  const countPending = reports.filter(r => r.status === REPORT_STATUS.PENDING).length;
  const countInvestigating = reports.filter(r => r.status === REPORT_STATUS.INVESTIGATING).length;
  const countCritical = reports.filter(r => r.severity === 'CRITICAL' && r.status !== REPORT_STATUS.RESOLVED).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Municipal Moderation Console"
        description="Verify uploaded ecological incidents, triage hazardous substances, and coordinate volunteer cleanup resources."
      />

      {/* Stats KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Pending Queue"
          value={countPending}
          iconName="Clock"
          description="Reports submitted awaiting image and location validation."
          colorClass="text-yellow-400"
        />
        <StatsCard
          title="Under Investigation"
          value={countInvestigating}
          iconName="Layers"
          description="Incidents assigned to field officers for inspection."
          colorClass="text-blue-400"
        />
        <StatsCard
          title="Active Critical Piles"
          value={countCritical}
          iconName="AlertTriangle"
          description="Chemical or toxic wastes requiring urgent intervention."
          colorClass="text-rose-400"
        />
        <StatsCard
          title="Total Incidents Logged"
          value={reports.length}
          iconName="ShieldAlert"
          description="Total historical incidents submitted by platform volunteers."
          colorClass="text-emerald-400"
        />
      </div>

      {/* Moderation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Table list - Left 2 Columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 border-b border-forest-900/10 pb-3">
            <Layers className="h-5 w-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white font-heading">Moderation Registry</h3>
          </div>

          <AdminTable
            reports={reports}
            onUpdateStatus={handleUpdateStatus}
            onSelectReport={(r) => setSelectedReport(r)}
          />
        </div>

        {/* Selected detail panel - Right 1 Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-forest-900/10 pb-3">
            <Layers className="h-5 w-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white font-heading">Incident Detail Review</h3>
          </div>

          {selectedReport ? (
            <div className="glass-panel rounded-xl overflow-hidden border border-forest-900/40 p-5 space-y-4 animate-fade-in-up">
              
              {/* Photo representation */}
              <div className="h-40 w-full rounded-lg bg-slate-950 overflow-hidden border border-slate-900">
                {selectedReport.imageUrl ? (
                  <img
                    src={selectedReport.imageUrl}
                    alt={selectedReport.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-600 text-xs">
                    No Photograph Uploaded
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-emerald-500 uppercase">
                  Report ID: #{selectedReport.id}
                </span>
                <h4 className="text-base font-bold text-white leading-tight">{selectedReport.title}</h4>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Submitted by {selectedReport.reporterName || 'Anonymous User'}
                </p>
              </div>

              <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-slate-950 text-slate-300`}>
                  {WASTE_TYPE_DETAILS[selectedReport.wasteType]?.label || selectedReport.wasteType}
                </span>
                <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-slate-950 ${
                  selectedReport.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {selectedReport.severity}
                </span>
              </div>

              <div className="text-xs text-slate-350 leading-relaxed border-t border-slate-900/50 pt-3 space-y-2">
                <p>{selectedReport.description}</p>
                
                <div className="text-[10px] text-slate-500 leading-normal bg-slate-950/60 p-2.5 rounded border border-slate-900 space-y-0.5">
                  <p><strong>Geotag address:</strong> {selectedReport.address}</p>
                  <p><strong>GPS coordinates:</strong> {selectedReport.latitude}, {selectedReport.longitude}</p>
                </div>
              </div>

              {/* Status Action Buttons inside details panel */}
              <div className="border-t border-slate-900/50 pt-4 flex gap-2">
                {selectedReport.status === REPORT_STATUS.PENDING && (
                  <button
                    onClick={() => handleUpdateStatus(selectedReport.id, REPORT_STATUS.INVESTIGATING)}
                    className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 py-2 text-xs font-bold text-white transition-colors"
                  >
                    Start Investigation
                  </button>
                )}
                {selectedReport.status === REPORT_STATUS.INVESTIGATING && (
                  <button
                    onClick={() => handleUpdateStatus(selectedReport.id, REPORT_STATUS.CLEANUP_SCHEDULED)}
                    className="flex-1 rounded-lg bg-purple-600 hover:bg-purple-700 py-2 text-xs font-bold text-white transition-colors"
                  >
                    Schedule Cleanup Event
                  </button>
                )}
                {selectedReport.status === REPORT_STATUS.CLEANUP_SCHEDULED && (
                  <button
                    onClick={() => handleUpdateStatus(selectedReport.id, REPORT_STATUS.RESOLVED)}
                    className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 py-2 text-xs font-bold text-white transition-colors"
                  >
                    Mark Cleaned & Resolved
                  </button>
                )}
                
                {selectedReport.status !== REPORT_STATUS.RESOLVED && selectedReport.status !== REPORT_STATUS.REJECTED && (
                  <button
                    onClick={() => handleUpdateStatus(selectedReport.id, REPORT_STATUS.REJECTED)}
                    className="rounded-lg bg-rose-600/15 hover:bg-rose-600/30 border border-rose-500/20 px-3 py-2 text-xs font-semibold text-rose-400 transition-colors"
                  >
                    Reject Report
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="glass-panel rounded-xl p-6 text-center text-slate-500">
              Select an incident row from the registry table to moderate.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
