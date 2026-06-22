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