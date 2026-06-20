import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from "react";
import type { Report } from '../../types';

interface LeafletMapProps {
 reports: Report[];
 onSelectReport?: (report: Report) => void;
}

function FitBounds({ reports }: { reports: Report[] }) {
 const map = useMap();

 useEffect(() => {
  if (!reports.length) return;

  if (reports.length === 1) {
   map.setView(
    [reports[0].latitude, reports[0].longitude],
    13
   );
   return;
  }

  const bounds = reports.map((r) => [
   r.latitude,
   r.longitude
  ]) as [number, number][];

  map.fitBounds(bounds, {
   padding: [50, 50]
  });
 }, [reports, map]);

 return null;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
 reports,
 onSelectReport,
}) => {
 return (
  <MapContainer
   center={[23.0225, 72.5714]}
   zoom={12}
   style={{ height: '450px', width: '100%' }}
  >

   <FitBounds reports={reports} />

   <TileLayer
    attribution='&copy; OpenStreetMap contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
   />

   {reports.map((report) => (
    <Marker
     key={report.id}
     position={[report.latitude, report.longitude]}
     eventHandlers={{
      click: () => {
       onSelectReport?.(report);
      },
     }}
    >
     <Popup>
      <div className="space-y-1">
       <h3 className="font-bold">{report.title}</h3>

       <p>{report.description}</p>

       <p>
        <strong>Severity:</strong> {report.severity}
       </p>

       <p>
        <strong>Status:</strong> {report.status}
       </p>

       <p>
        <strong>Waste Type:</strong> {report.wasteType}
       </p>
      </div>
     </Popup>
    </Marker>
   ))}
  </MapContainer>
 );
};