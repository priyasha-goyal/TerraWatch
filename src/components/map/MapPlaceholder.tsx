import React, { useState } from 'react';
import { ShieldAlert, MapPin, Eye, Compass } from 'lucide-react';
import type { Report } from '../../types';

interface MapPlaceholderProps {
  reports: Report[];
  onSelectReport?: (report: Report) => void;
  selectedReportId?: string;
  heightClass?: string;
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ 
  reports, 
  onSelectReport, 
  selectedReportId,
  heightClass = 'h-[400px]'
}) => {
  const [hoveredReport, setHoveredReport] = useState<Report | null>(null);

  // Normalize lat/lng to map coordinates (width 800, height 400)
  // Let's assume bounds matching a local municipality roughly
  const getMapCoordinates = (lat: number, lng: number) => {
    // Map bounds simulation
    // Center: ~ 43.65, -79.38 (e.g. Toronto region)
    const minLat = 43.60;
    const maxLat = 43.70;
    const minLng = -79.48;
    const maxLng = -79.28;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100; // percent
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100; // percent

    return { 
      x: `${Math.max(10, Math.min(90, x))}%`, 
      y: `${Math.max(10, Math.min(90, y))}%` 
    };
  };

  const getSeverityColor = (severity: Report['severity']) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-rose-500 shadow-rose-500/50';
      case 'HIGH': return 'bg-orange-500 shadow-orange-500/50';
      case 'MEDIUM': return 'bg-amber-500 shadow-amber-500/50';
      default: return 'bg-emerald-500 shadow-emerald-500/50';
    }
  };

  return (
    <div className="relative w-full rounded-xl border border-forest-900/40 bg-slate-950 overflow-hidden shadow-2xl">
      {/* Map Control Grid overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-lg bg-slate-900/90 border border-forest-900/30 px-3 py-1.5 text-xs text-slate-200 backdrop-blur-sm">
          <Compass className="h-4.5 w-4.5 text-emerald-400 animate-spin-slow" />
          <span className="font-semibold">Local Eco-Watch Grid</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <div className="flex items-center gap-1.5 rounded-lg bg-slate-900/95 border border-forest-900/30 px-2.5 py-1.5 text-[11px] text-slate-300">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Critical</span>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-500 ml-2" />
          <span>High</span>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 ml-2" />
          <span>Medium</span>
        </div>
      </div>

      {/* SVG Map Grid Layout */}
      <div className={`relative w-full ${heightClass} bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] flex items-center justify-center`}>
        {/* Background contour lines simulated via simple vector elements */}
        <svg className="absolute inset-0 w-full h-full text-forest-950/20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M -100,200 Q 150,50 400,220 T 900,100" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M -50,300 Q 250,150 500,320 T 1050,200" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 100,400 Q 450,250 700,420 T 1250,300" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="50%" cy="50%" r="280" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="50%" cy="50%" r="180" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
        </svg>

        {/* Dynamic Markers */}
        {reports.map((report) => {
          const coords = getMapCoordinates(report.latitude, report.longitude);
          const isSelected = selectedReportId === report.id;
          const isHovered = hoveredReport?.id === report.id;
          const severityColor = getSeverityColor(report.severity);

          return (
            <div
              key={report.id}
              style={{ left: coords.x, top: coords.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
              onClick={() => onSelectReport?.(report)}
              onMouseEnter={() => setHoveredReport(report)}
              onMouseLeave={() => setHoveredReport(null)}
            >
              {/* Outer pulsing ring */}
              <span className={`absolute -inset-2 rounded-full opacity-60 animate-ping-slow ${
                report.severity === 'CRITICAL' ? 'bg-rose-500/30' : report.severity === 'HIGH' ? 'bg-orange-500/30' : 'bg-amber-500/30'
              }`} />
              
              {/* Core Node Marker */}
              <div className={`h-4.5 w-4.5 rounded-full border-2 border-slate-900 transition-all duration-300 relative ${severityColor} ${
                isSelected ? 'scale-150 ring-4 ring-emerald-500/30' : 'group-hover:scale-125'
              }`} />

              {/* Tooltip Overlay */}
              {isHovered && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-48 rounded-lg bg-slate-900/95 border border-forest-900/40 p-2 text-xs text-white shadow-xl backdrop-blur-sm pointer-events-none">
                  <p className="font-semibold truncate">{report.title}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{report.address}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300">
                      {report.wasteType.replace('_', ' ')}
                    </span>
                    <span className={`text-[9px] font-bold ${
                      report.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {report.severity}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {reports.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 text-slate-500 z-10 px-4 text-center">
            <MapPin className="h-8 w-8 text-forest-700 animate-bounce" />
            <p className="text-sm font-semibold">No Incidents Map Markers Registered</p>
            <p className="text-xs text-slate-600 max-w-xs">Reports submitted by environmental watchers will appear dynamically on this topographic watch node.</p>
          </div>
        )}
      </div>

      {/* Footer Info details (Selected Incident Summary card) */}
      {reports.find(r => r.id === selectedReportId) && (
        <div className="border-t border-forest-900/30 bg-slate-900/80 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-sm">
          {(() => {
            const report = reports.find(r => r.id === selectedReportId)!;
            return (
              <>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-forest-950 p-2 border border-forest-800/40 text-emerald-400 shrink-0">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">{report.title}</h5>
                    <p className="text-xs text-slate-400 truncate max-w-md mt-0.5">{report.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800/50 pt-2 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] text-slate-500">Coordinates</p>
                    <p className="text-xs font-mono text-slate-300 mt-0.5">
                      {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}
                    </p>
                  </div>
                  {onSelectReport && (
                    <button
                      onClick={() => onSelectReport(report)}
                      className="flex items-center gap-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Focus Detail</span>
                    </button>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
