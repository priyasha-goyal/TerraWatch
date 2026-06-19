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
      case 'CRITICAL': return 'bg-rose-500 ring-rose-200';
      case 'HIGH': return 'bg-orange-500 ring-orange-200';
      case 'MEDIUM': return 'bg-amber-500 ring-amber-200';
      default: return 'bg-emerald-500 ring-emerald-200';
    }
  };

  return (
    <div className="relative w-full rounded-xl border border-[#E5EDE8] bg-white overflow-hidden shadow-sm">
      {/* Map Control Grid overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-lg bg-white/90 border border-[#E5EDE8] px-3 py-1.5 text-xs text-[#1F2937] shadow-sm backdrop-blur-sm">
          <Compass className="h-4.5 w-4.5 text-[#2E7D32] animate-spin-slow" />
          <span className="font-semibold">Local Eco-Watch Grid</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <div className="flex items-center gap-1.5 rounded-lg bg-white/90 border border-[#E5EDE8] px-2.5 py-1.5 text-[11px] text-[#6B7280] shadow-sm backdrop-blur-sm">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Critical</span>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-500 ml-2" />
          <span>High</span>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 ml-2" />
          <span>Medium</span>
        </div>
      </div>

      {/* SVG Map Grid Layout */}
      <div className={`relative w-full ${heightClass} bg-[#FAFAF8] bg-[radial-gradient(#E5EDE8_1.5px,transparent_1.5px)] [background-size:24px_24px] flex items-center justify-center`}>
        {/* Background contour lines simulated via simple vector elements */}
        <svg className="absolute inset-0 w-full h-full text-[#E5EDE8] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M -100,200 Q 150,50 400,220 T 900,100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
          <path d="M -50,300 Q 250,150 500,320 T 1050,200" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
          <path d="M 100,400 Q 450,250 700,420 T 1250,300" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
          <circle cx="50%" cy="50%" r="280" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" strokeOpacity="0.4" />
          <circle cx="50%" cy="50%" r="180" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" strokeOpacity="0.4" />
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
                report.severity === 'CRITICAL' ? 'bg-rose-500/20' : report.severity === 'HIGH' ? 'bg-orange-500/20' : 'bg-amber-500/20'
              }`} />
              
              {/* Core Node Marker */}
              <div className={`h-4.5 w-4.5 rounded-full border-2 border-white transition-all duration-300 relative shadow-sm ${severityColor} ${
                isSelected ? 'scale-150 ring-4 ring-[#2E7D32]/25' : 'group-hover:scale-125'
              }`} />

              {/* Tooltip Overlay */}
              {isHovered && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-48 rounded-lg bg-white border border-[#E5EDE8] p-2 text-xs text-[#1F2937] shadow-lg pointer-events-none">
                  <p className="font-semibold truncate">{report.title}</p>
                  <p className="text-[10px] text-[#6B7280] truncate mt-0.5">{report.address}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#4B5563]">
                      {report.wasteType.replace('_', ' ')}
                    </span>
                    <span className={`text-[9px] font-bold ${
                      report.severity === 'CRITICAL' ? 'text-rose-600' : 'text-amber-600'
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
          <div className="flex flex-col items-center justify-center gap-2 text-[#9CA3AF] z-10 px-4 text-center">
            <MapPin className="h-8 w-8 text-[#CCDCD1] animate-bounce" />
            <p className="text-sm font-semibold text-[#1F2937]">No Incidents Map Markers Registered</p>
            <p className="text-xs text-[#6B7280] max-w-xs">Reports submitted by environmental watchers will appear dynamically on this topographic watch node.</p>
          </div>
        )}
      </div>

      {/* Footer Info details (Selected Incident Summary card) */}
      {reports.find(r => r.id === selectedReportId) && (
        <div className="border-t border-[#E5EDE8] bg-[#FAFAF8] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {(() => {
            const report = reports.find(r => r.id === selectedReportId)!;
            return (
              <>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-[#E8F5E9] p-2 border border-[#CCDCD1] text-[#2E7D32] shrink-0">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#1F2937]">{report.title}</h5>
                    <p className="text-xs text-[#6B7280] truncate max-w-md mt-0.5">{report.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-[#E5EDE8] pt-2 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] text-[#9CA3AF]">Coordinates</p>
                    <p className="text-xs font-mono text-[#4B5563] mt-0.5">
                      {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}
                    </p>
                  </div>
                  {onSelectReport && (
                    <button
                      onClick={() => onSelectReport(report)}
                      className="flex items-center gap-1 rounded-lg bg-[#E8F5E9] hover:bg-[#D0E7D2] border border-[#CCDCD1] px-3 py-1.5 text-xs font-medium text-[#2E7D32] transition-colors"
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
