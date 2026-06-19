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
            <h3 className="text-lg font-bold text-green-900 font-heading">Interactive Remediation Grid</h3>
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
            <h3 className="text-lg font-bold text-green-900 font-heading">Focused Node Triage</h3>
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
                  <p className="font-semibold text-slate-600">Ecotonal Threat Overlay</p>
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
      {/* Protected Species Nearby Table */}
<div className="space-y-6 pt-6">
  <div className="flex items-center gap-3 border-b border-green-200 pb-4">
    <TreePine className="h-6 w-6 text-green-700" />
    <h3 className="text-2xl font-bold text-green-900">
      Protected Local Faunal Inventory
    </h3>
  </div>

  <div className="overflow-hidden rounded-3xl bg-white shadow-lg border border-green-100">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-green-700 text-white">
          <th className="px-6 py-4 text-left">Species</th>
          <th className="px-6 py-4 text-left">Scientific Name</th>
          <th className="px-6 py-4 text-center">Status</th>
          <th className="px-6 py-4 text-center">Trend</th>
          <th className="px-6 py-4 text-center">Population</th>
          <th className="px-6 py-4 text-right">Sanctuary</th>
        </tr>
      </thead>

      <tbody>
        {MOCK_SPECIES_LIST.map((sp, index) => (
          <tr
            key={sp.id}
            className={`transition hover:bg-green-50 ${
              index % 2 === 0 ? "bg-white" : "bg-emerald-50/30"
            }`}
          >
            <td className="px-6 py-5">
              <div className="font-semibold text-green-900">
                {sp.name}
              </div>
            </td>

            <td className="px-6 py-5 italic text-green-700">
              {sp.scientificName}
            </td>

            <td className="px-6 py-5 text-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  sp.status.includes("Critically")
                    ? "bg-red-100 text-red-700"
                    : sp.status.includes("Endangered")
                    ? "bg-orange-100 text-orange-700"
                    : sp.status.includes("Threatened")
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {sp.status}
              </span>
            </td>

            <td className="px-6 py-5 text-center font-semibold">
              <span
                className={
                  sp.trend === "Increasing"
                    ? "text-green-600"
                    : sp.trend === "Recovering"
                    ? "text-emerald-600"
                    : "text-amber-600"
                }
              >
                {sp.trend}
              </span>
            </td>

            <td className="px-6 py-5 text-center font-medium text-slate-700">
              {sp.count}
            </td>

            <td className="px-6 py-5 text-right text-green-800 font-medium">
              {sp.region}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
};
