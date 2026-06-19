import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import { PageHeader } from '../../components/common/PageHeader';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { ActivityCard } from '../../components/dashboard/ActivityCard';
import type { ActivityItem } from '../../components/dashboard/ActivityCard';
import { ReportCard } from '../../components/reports/ReportCard';
import type { Report } from '../../types';
import { Plus, Layers, ShieldAlert } from 'lucide-react';
import { reportsServiceShell } from '../../services/reports';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }

    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        const [fetchedReports, fetchedLogs] = await Promise.all([
          reportsServiceShell.getReports(),
          reportsServiceShell.getCleanupLogs(),
        ]);

        if (!isMounted) return;

        setReports(fetchedReports);

        const reportActivities: ActivityItem[] = fetchedReports.map(r => ({
          id: `act-rep-${r.id}`,
          type: 'REPORT',
          title: 'Incident Reported',
          subtitle: `${r.title} (#${r.id})`,
          timestamp: r.createdAt,
        }));

        const cleanupActivities: ActivityItem[] = fetchedLogs.map(l => ({
          id: `act-cln-${l.id}`,
          type: 'CLEANUP',
          title: 'Habitat Cleanup Logged',
          subtitle: `${l.reportTitle} - ${l.description}`,
          timestamp: l.date,
          value: `${l.volunteersCount} volunteers`,
        }));

        const allActivities = [...reportActivities, ...cleanupActivities].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setActivities(allActivities);
      } catch (e) {
        console.error('Failed to load dashboard data:', e);
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header section with Action Button */}
      <PageHeader
        title={`Welcome, ${user.name}`}
        description="Monitor your logged pollution incidents, check your carbon offsets, and manage EcoCoin credit achievements."
        action={
          <Link
            to={ROUTES.REPORT_WASTE}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-500/10 transition-all hover:scale-[1.01]"
          >
            <Plus className="h-4 w-4" />
            <span>Report Dumping</span>
          </Link>
        }
      />

      {/* KPI Cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="EcoCoins Balance"
          value={`${user.ecoCoinBalance} Coins`}
          iconName="Coins"
          description="Exchangeable for public transit offsets and ecological vendor credits."
          trend={{ value: '+50 this week', isPositive: true }}
          colorClass="text-yellow-400"
        />
        <StatsCard
          title="My Incident Reports"
          value={reports.length}
          iconName="ShieldAlert"
          description="Reports logged across municipal biodiversity buffer zones."
          colorClass="text-emerald-400"
        />
        <StatsCard
          title="Validation Index"
          value="100%"
          iconName="Award"
          description="Citizen trust rating calculated from verified image reports."
          colorClass="text-cyan-400"
        />
      </div>

      {/* Main Panel Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: User Reports */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-forest-900/10 pb-3">
            <h3 className="text-lg font-bold text-green-900 font-heading flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-400" />
              My Active Reports
            </h3>
            <span className="text-xs text-slate-400">Showing {reports.length} reports</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onViewDetails={() => navigate(ROUTES.IMPACT)}
              />
            ))}

            {reports.length === 0 && (
              <div className="col-span-2 glass-panel rounded-xl p-8 text-center text-slate-500 space-y-3">
                <ShieldAlert className="h-10 w-10 text-forest-800 mx-auto" />
                <p className="font-semibold text-sm">No incidents reported yet</p>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">Click the button above to log your first waste dumping incident.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Activity Feed */}
        <div className="space-y-6">
          <ActivityCard activities={activities} title="My Volunteer Feed" />

          {/* Mini Guide Panel */}
          <div className="rounded-xl border border-forest-900/40 bg-slate-900/20 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Citizen Rewards Guide</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p>
                1. <strong>Submit Report</strong>: Photograph waste dumping. AI processes contents instantly.
              </p>
              <p>
                2. <strong>Earn EcoCoins</strong>: Once municipal officers validate the incident, you receive 50 EcoCoins.
              </p>
              <p>
                3. <strong>Ecosystem Impact</strong>: Join cleanup logs. Volunteering grants 100 EcoCoins and boosts your district trust score.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
