import React, { useEffect, useState } from 'react';
import { reportsServiceShell } from '../../services/reports';
import type { Report } from '../../types';

export const MyReportsPage: React.FC = () => {
 const [reports, setReports] = useState<Report[]>([]);

 useEffect(() => {
  reportsServiceShell.getMyReports().then(setReports);
 }, []);

 return (
  <div className="space-y-6">
   <h1 className="text-3xl font-bold text-green-900">
    My Reports
   </h1>

   {reports.length === 0 ? (
    <div className="bg-white p-6 rounded-xl shadow">
     No reports submitted yet.
    </div>
   ) : (
    reports.map((report) => (
     <div
      key={report.id}
      className="bg-white rounded-xl shadow p-5 border"
     >
      <h2 className="font-bold text-lg">
       {report.title}
      </h2>

      {report.imageUrl && (
       <img
        src={report.imageUrl}
        alt={report.title}
        className="w-full h-56 object-cover rounded-lg mb-4 mt-3"
       />
      )}

      <p className="text-sm text-gray-600 mt-2">
       {report.description}
      </p>

      <div className="flex gap-3 mt-4 text-sm">
       <span>
        Status: <strong>{report.status}</strong>
       </span>

       <span>
        Severity: <strong>{report.severity}</strong>
       </span>
      </div>

      <div className="text-xs text-gray-500 mt-2">
       Submitted:
       {' '}
       {new Date(report.createdAt).toLocaleDateString()}
      </div>
     </div>
    ))
   )}
  </div>
 );
};


// import React, { useEffect, useState } from 'react';
// import { reportsServiceShell } from '../../services/reports';
// import { useAuth } from '../../contexts/AuthContext';
// import type { Report } from '../../types';
// import { STATUS_DETAILS, WASTE_TYPE_DETAILS } from '../../constants/status';
// import {
//   ShieldAlert,
//   MapPin,
//   Calendar,
//   Brain,
//   UserCircle,
//   EyeOff,
//   Layers,
//   CheckCircle2,
// } from 'lucide-react';

// /* ─── tiny helpers ─────────────────────────────────────── */
// const fmt = (d: string) =>
//   new Date(d).toLocaleDateString('en-IN', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric',
//   });

// const severityClass: Record<string, string> = {
//   CRITICAL: 'bg-rose-50 border-rose-200 text-rose-600',
//   HIGH: 'bg-orange-50 border-orange-200 text-orange-600',
//   MEDIUM: 'bg-amber-50 border-amber-200 text-amber-600',
//   LOW: 'bg-emerald-50 border-emerald-200 text-emerald-600',
// };

// /* ─── single report card ───────────────────────────────── */
// interface CardProps {
//   report: Report;
//   isOwn: boolean;
// }

// const ReportItem: React.FC<CardProps> = ({ report, isOwn }) => {
//   const statusInfo = STATUS_DETAILS[report.status];
//   const typeInfo = WASTE_TYPE_DETAILS[report.wasteType];

//   return (
//     <div
//       className={`rounded-xl overflow-hidden border bg-white transition-all duration-200 hover:shadow-md ${
//         isOwn
//           ? 'border-[#2E7D32]/30 ring-1 ring-[#2E7D32]/10'
//           : 'border-[#E5EDE8]'
//       }`}
//     >
//       {/* Image strip */}
//       <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
//         {report.imageUrl && isOwn ? (
//           <img
//             src={report.imageUrl}
//             alt={report.title}
//             className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
//           />
//         ) : (
//           <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#FAFAF8] to-[#E5EDE8] text-[#6B7280] text-center p-4">
//             {isOwn ? (
//               <>
//                 <ShieldAlert className="h-9 w-9 text-[#CCDCD1] mb-1.5" />
//                 <span className="text-xs font-medium">No photograph uploaded</span>
//               </>
//             ) : (
//               <>
//                 <EyeOff className="h-9 w-9 text-[#CCDCD1] mb-1.5" />
//                 <span className="text-xs font-medium text-[#9CA3AF]">
//                   Photo hidden for privacy
//                 </span>
//               </>
//             )}
//           </div>
//         )}

//         {/* Badges */}
//         <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
//           <span
//             className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
//               severityClass[report.severity]
//             }`}
//           >
//             {report.severity}
//           </span>
//           <span
//             className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${statusInfo.badgeClass}`}
//           >
//             {statusInfo.label}
//           </span>
//         </div>

//         {/* Own-report crown */}
//         {isOwn && (
//           <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-[#2E7D32]/90 px-2.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm shadow-sm">
//             <CheckCircle2 className="h-3 w-3" />
//             <span>My Report</span>
//           </div>
//         )}

//         {/* AI pill */}
//         {report.aiConfidence !== undefined && (
//           <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 border border-[#CCDCD1] px-2.5 py-0.5 text-[9px] font-bold text-[#2E7D32] backdrop-blur-sm shadow-sm">
//             <Brain className="h-3 w-3" />
//             <span>AI Verified ({(report.aiConfidence * 100).toFixed(0)}%)</span>
//           </div>
//         )}
//       </div>

//       {/* Body */}
//       <div className="p-4 space-y-2.5">
//         <div>
//           <span className="text-[10px] font-bold uppercase tracking-widest text-[#2E7D32]">
//             {typeInfo?.label || report.wasteType.replace('_', ' ')}
//           </span>
//           <h4 className="text-sm font-bold text-[#1F2937] leading-snug line-clamp-1 mt-0.5">
//             {report.title}
//           </h4>
//         </div>

//         {isOwn ? (
//           <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
//             {report.description}
//           </p>
//         ) : (
//           <p className="text-xs text-[#9CA3AF] italic">
//             Description hidden — reported anonymously
//           </p>
//         )}

//         <div className="pt-2 border-t border-[#F5F7F5] space-y-1 text-[11px] text-[#6B7280]">
//           <div className="flex items-center gap-1.5">
//             <MapPin className="h-3.5 w-3.5 text-[#2E7D32] shrink-0" />
//             <span className="truncate">
//               {report.address || `${report.latitude?.toFixed(4)}, ${report.longitude?.toFixed(4)}`}
//             </span>
//           </div>
//           <div className="flex items-center gap-1.5">
//             <Calendar className="h-3.5 w-3.5 text-[#2E7D32] shrink-0" />
//             <span>Logged on {fmt(report.createdAt)}</span>
//           </div>
//           <div className="flex items-center gap-1.5">
//             {isOwn ? (
//               <UserCircle className="h-3.5 w-3.5 text-[#2E7D32] shrink-0" />
//             ) : (
//               <EyeOff className="h-3.5 w-3.5 text-[#9CA3AF] shrink-0" />
//             )}
//             <span className={isOwn ? '' : 'text-[#9CA3AF] italic'}>
//               {isOwn ? 'Reported by you' : 'Anonymous citizen'}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─── tab types ────────────────────────────────────────── */
// type Tab = 'mine' | 'community';

// /* ─── page ─────────────────────────────────────────────── */
// export const MyReportsPage: React.FC = () => {
//   const { user } = useAuth();
//   const [myReports, setMyReports] = useState<Report[]>([]);
//   const [communityReports, setCommunityReports] = useState<Report[]>([]);
//   const [activeTab, setActiveTab] = useState<Tab>('mine');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         const [all, mine] = await Promise.all([
//           reportsServiceShell.getReports(),
//           reportsServiceShell.getMyReports(),
//         ]);

//         const myIds = new Set(mine.map((r) => r.id));
//         setMyReports(mine);
//         // Community = all reports NOT submitted by current user, images/details stripped
//         setCommunityReports(
//           all
//             .filter((r) => !myIds.has(r.id))
//             .map((r) => ({
//               ...r,
//               imageUrl: undefined,         // hide photo
//               description: '',             // hide description
//               reporterName: undefined,     // hide name
//               reporterId: '',              // anonymise ID
//             }))
//         );
//       } catch (e) {
//         console.error('MyReports load error:', e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   const tabBtn = (tab: Tab, label: string, count: number) => (
//     <button
//       onClick={() => setActiveTab(tab)}
//       className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
//         activeTab === tab
//           ? 'bg-[#2E7D32] text-white shadow-md'
//           : 'bg-white text-[#4B5563] border border-[#E5EDE8] hover:border-[#CCDCD1]'
//       }`}
//     >
//       {label}
//       <span
//         className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
//           activeTab === tab ? 'bg-white/20 text-white' : 'bg-[#F0F7F1] text-[#2E7D32]'
//         }`}
//       >
//         {count}
//       </span>
//     </button>
//   );

//   const shown = activeTab === 'mine' ? myReports : communityReports;

//   return (
//     <div className="space-y-6">
//       {/* Page header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-green-900">Reports</h1>
//           <p className="text-sm text-[#6B7280] mt-1">
//             Your submissions are shown in full. Community reports are anonymised for privacy.
//           </p>
//         </div>

//         {/* Privacy notice chip */}
//         <div className="flex items-center gap-2 rounded-full bg-[#F0F7F1] border border-[#CCDCD1] px-3.5 py-1.5 text-xs font-medium text-[#2E7D32]">
//           <EyeOff className="h-3.5 w-3.5" />
//           <span>Community data is anonymised</span>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-3">
//         {tabBtn('mine', 'My Reports', myReports.length)}
//         {tabBtn('community', 'Community Reports', communityReports.length)}
//       </div>

//       {/* Tab context note */}
//       {activeTab === 'community' && (
//         <div className="flex items-start gap-3 rounded-xl bg-[#FFFBEB] border border-amber-200 px-4 py-3 text-xs text-amber-700">
//           <EyeOff className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
//           <span>
//             Reporter identities, photos, and descriptions are hidden to protect citizen privacy.
//             Only location, waste type, severity, and status are shown.
//           </span>
//         </div>
//       )}

//       {/* Grid */}
//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="rounded-xl border border-[#E5EDE8] bg-white h-72 animate-pulse" />
//           ))}
//         </div>
//       ) : shown.length === 0 ? (
//         <div className="rounded-xl border border-[#E5EDE8] bg-white p-10 text-center space-y-3">
//           <Layers className="h-10 w-10 text-[#CCDCD1] mx-auto" />
//           <p className="font-semibold text-sm text-[#4B5563]">
//             {activeTab === 'mine'
//               ? 'No reports submitted yet'
//               : 'No community reports available'}
//           </p>
//           {activeTab === 'mine' && (
//             <p className="text-xs text-[#9CA3AF]">
//               Head to "Report Dumping" to log your first incident.
//             </p>
//           )}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {shown.map((r) => (
//             <ReportItem key={r.id} report={r} isOwn={activeTab === 'mine'} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };