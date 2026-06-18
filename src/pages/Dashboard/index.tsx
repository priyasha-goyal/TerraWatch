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

    // Set mock dashboard data
    const mockReports: Report[] = [
      {
        id: 'rep-101',
        reporterId: user.id,
        title: 'Large pile of plastic bottles near riparian buffer',
        description: 'Over 50 discarded plastic soft drink bottles and packaging materials floating on the shoreline, threatening waterfowl nesting grounds.',
        wasteType: 'PLASTIC',
        severity: 'MEDIUM',
        latitude: 43.64532,
        longitude: -79.37812,
        address: 'High Park South Pond Boardwalk, Toronto, ON',
        imageUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&auto=format&fit=crop&q=80',
        status: 'INVESTIGATING',
        aiConfidence: 0.94,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'rep-102',
        reporterId: user.id,
        title: 'Toxic battery fluid drums disposed illegally',
        description: 'Two large steel drums containing industrial battery casings and chemical leakage dumped off the trail. Strong solvent odors.',
        wasteType: 'CHEMICAL',
        severity: 'CRITICAL',
        latitude: 43.66782,
        longitude: -79.41245,
        address: 'Ravine Trail Entrance, Cedarvale Park, Toronto, ON',
        imageUrl: 'https://images.unsplash.com/photo-1605600656308-972a4e843af0?w=600&auto=format&fit=crop&q=80',
        status: 'CLEANUP_SCHEDULED',
        aiConfidence: 0.88,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];

    const mockActivities: ActivityItem[] = [
      {
        id: 'act-1',
        type: 'ECOCOIN',
        title: 'Awarded 50 EcoCoins',
        subtitle: 'Validation of plastic dumping report #rep-101',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        value: '+50 Coins',
      },
      {
        id: 'act-2',
        type: 'REPORT',
        title: 'Report Logged',
        subtitle: 'Toxic battery fluid drums (#rep-102)',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'act-3',
        type: 'CLEANUP',
        title: 'Cleanup Event Logged',
        subtitle: 'Cleaned trail pathway beside high park buffer',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        value: '12 volunteers',
      }
    ];

    // Load from local storage if exists to reflect new creations dynamically
    const storedReports = localStorage.getItem('tw_reports');
    if (storedReports) {
      try {
        const parsed = JSON.parse(storedReports) as Report[];
        // filter user's reports or merge
        const userReports = parsed.filter(r => r.reporterId === user.id);
        const merged = [...userReports, ...mockReports.filter(mr => !userReports.some(ur => ur.id === mr.id))];
        setReports(merged);
      } catch (e) {
        setReports(mockReports);
      }
    } else {
      setReports(mockReports);
    }

    setActivities(mockActivities);
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
            <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
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
