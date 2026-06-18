import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { MapPlaceholder } from '../../components/map/MapPlaceholder';
import { MOCK_SPECIES_LIST } from '../../constants/biodiversity';
import type { Report } from '../../types';
import { 
  TreePine, 
  Map, 
  Activity,
  AlertCircle
} from 'lucide-react';
import { REPORT_STATUS } from '../../constants/status';
import { reportsServiceShell } from '../../services/reports';

export const ImpactDashboardPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    let isMounted = true;
    reportsServiceShell.getReports().then((data) => {
      if (isMounted) {
        setReports(data);
        if (data.length > 0) {
          setSelectedReport(data[0]);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const totalWasteDiverted = reports
    .filter(r => r.status === REPORT_STATUS.RESOLVED)
    .reduce((sum, r) => sum + (r.severity === 'CRITICAL' ? 500 : r.severity === 'HIGH' ? 250 : 100), 450);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Community Eco-Impact Analytics"
        description="Public statistics monitoring ecosystem health index levels, volume of waste diverted, and ongoing biodiversity sanctuary restoration."
      />

      {/* Main Impact Grid Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Biodiversity Score"
          value="78 / 100"
          iconName="TreePine"
          description="Ecosystem index calculated from species sightings & pollution clearance."
          trend={{ value: '+2.4% this quarter', isPositive: true }}
          colorClass="text-emerald-400"
        />
        <StatsCard
          title="Total Waste Diverted"
          value={`${totalWasteDiverted} kg`}
          iconName="Trash2"
          description="Debris and chemical canisters cleared from woodlands."
          trend={{ value: '+350 kg this month', isPositive: true }}
          colorClass="text-teal-400"
        />
        <StatsCard
          title="Carbon Saved"
          value="1,850 kg CO2"
          iconName="Leaf"
          description="Carbon offset calculated from soil restoration actions."
          colorClass="text-mint-400"
        />
        <StatsCard
          title="Active Sanctuaries"
          value="12 sites"
          iconName="Award"
          description="Ecosystem buffers fully cleared of industrial pollution."
          colorClass="text-cyan-400"
        />
      </div>

      {/* Interactive Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Map Placeholder */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 border-b border-forest-900/10 pb-3">
            <Map className="h-5 w-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white font-heading">Interactive Remediation Grid</h3>
          </div>
          
          <MapPlaceholder 
            reports={reports} 
            selectedReportId={selectedReport?.id}
            onSelectReport={(r) => setSelectedReport(r)}
            heightClass="h-[450px]"
          />
        </div>

        {/* Selected Incident Sidebar Detail Panel */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-forest-900/10 pb-3">
            <Activity className="h-5 w-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white font-heading">Focused Node Triage</h3>
          </div>

          {selectedReport ? (
            <div className="glass-panel rounded-xl p-5 space-y-4 animate-fade-in-up">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                  ID: #{selectedReport.id}
                </span>
                <h4 className="text-base font-bold text-white leading-snug">{selectedReport.title}</h4>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] bg-slate-950 ${
                  selectedReport.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {selectedReport.severity} Severity
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 capitalize">{selectedReport.status.toLowerCase().replace('_', ' ')}</span>
              </div>

              <p className="text-xs text-slate-450 leading-relaxed border-t border-slate-900/50 pt-3">
                {selectedReport.description}
              </p>

              {/* Biological context warning simulation */}
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 flex gap-2 text-xs">
                <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">Ecotonal Threat Overlay</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Surrounding watershed buffers support vulnerable spawning cycles. Remediation recommended within 48 hours.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-xl p-6 text-center text-slate-500">
              Select an incident marker on the map to review ecological impacts.
            </div>
          )}
        </div>
      </div>

      {/* Protected Species Nearby Table */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 border-b border-forest-900/10 pb-3">
          <TreePine className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white font-heading">Protected Local Faunal Inventory</h3>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-forest-900/40 bg-slate-900/20">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-slate-900 border-b border-forest-900/30 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Common Name</th>
                <th className="py-3.5 px-6">Scientific Taxonomy</th>
                <th className="py-3.5 px-6 text-center">Conservation Status</th>
                <th className="py-3.5 px-6 text-center">Population Trend</th>
                <th className="py-3.5 px-6 text-center">Protected Population count</th>
                <th className="py-3.5 px-6 text-right">Ecosystem Sanctuary Zone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30 text-slate-300">
              {MOCK_SPECIES_LIST.map((sp) => (
                <tr key={sp.id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-white">{sp.name}</td>
                  <td className="py-3.5 px-6 italic text-slate-400">{sp.scientificName}</td>
                  <td className="py-3.5 px-6 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-950 ${
                      sp.status.includes('Endangered') ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {sp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-center font-semibold text-emerald-400">{sp.trend}</td>
                  <td className="py-3.5 px-6 text-center font-mono text-slate-400">{sp.count} individuals</td>
                  <td className="py-3.5 px-6 text-right text-slate-400 font-semibold">{sp.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
