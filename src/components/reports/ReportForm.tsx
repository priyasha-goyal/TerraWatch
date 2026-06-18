import React, { useState } from 'react';
import { WASTE_TYPES, WASTE_TYPE_DETAILS } from '../../constants/status';
import type { Report } from '../../types';
import { Camera, MapPin, Loader2 } from 'lucide-react';

interface ReportFormProps {
  onSubmit: (report: Omit<Report, 'id' | 'reporterId' | 'createdAt' | 'updatedAt' | 'status'> & { aiConfidence?: number }) => void;
  isSubmitting?: boolean;
}

export const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const [title, setTitle] = useState('');
  const [wasteType, setWasteType] = useState<keyof typeof WASTE_TYPES>('PLASTIC');
  const [severity, setSeverity] = useState<Report['severity']>('MEDIUM');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<string>('43.65322');
  const [longitude, setLongitude] = useState<string>('-79.38318');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local image preview
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
          setAddress('Acquired GPS coordinates via browser location api');
        },
        (error) => {
          console.error('GPS fetch error', error);
          const randomLat = (43.65 + (Math.random() - 0.5) * 0.08).toFixed(5);
          const randomLng = (-79.38 + (Math.random() - 0.5) * 0.08).toFixed(5);
          setLatitude(randomLat);
          setLongitude(randomLng);
          setAddress('Simulated coordinates near downtown area');
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !address) return;

    onSubmit({
      title,
      description,
      wasteType,
      severity,
      address,
      latitude: parseFloat(latitude) || 43.65322,
      longitude: parseFloat(longitude) || -79.38318,
      imageUrl: imageUrl || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column - Image & AI Placeholder */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-300">Incident Photograph Upload</label>
          
          <div className="relative h-60 w-full rounded-xl border border-dashed border-forest-800 bg-slate-900/50 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-emerald-500/40">
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <label className="cursor-pointer bg-slate-900/90 border border-slate-700 rounded-lg px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                    Replace Photograph
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center p-6 text-center h-full w-full">
                <Camera className="h-10 w-10 text-forest-600 mb-3" />
                <span className="text-sm font-medium text-slate-300">Choose file or drag & drop</span>
                <span className="text-xs text-slate-500 mt-1">Upload dump incident context image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>

          {imageUrl && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-405">
              <p className="font-semibold text-slate-300 mb-1">OpenAI Vision Triage Placeholder</p>
              <p className="text-slate-400">Image uploaded successfully. Real-time vision-based classification and composition analysis will run automatically upon backend integration.</p>
            </div>
          )}
        </div>

        {/* Right Column - Inputs */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-300">Incident Heading / Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Plastic heap blocking local creek trail"
              className="w-full rounded-lg border border-forest-900 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300">Waste Classification</label>
              <select
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value as keyof typeof WASTE_TYPES)}
                className="w-full rounded-lg border border-forest-900 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
              >
                {Object.entries(WASTE_TYPES).map(([key, val]) => (
                  <option key={key} value={val} className="bg-slate-950">
                    {WASTE_TYPE_DETAILS[val].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300">Severity Rating</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Report['severity'])}
                className="w-full rounded-lg border border-forest-900 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="LOW" className="bg-slate-950 text-emerald-400">LOW - Minor debris</option>
                <option value="MEDIUM" className="bg-slate-950 text-amber-400">MEDIUM - Clear ecological risk</option>
                <option value="HIGH" className="bg-slate-950 text-orange-400">HIGH - Large/Toxic heap</option>
                <option value="CRITICAL" className="bg-slate-950 text-rose-400">CRITICAL - Chemical spill/habitat blocked</option>
              </select>
            </div>
          </div>

          {/* Location details */}
          <div className="space-y-3 rounded-lg border border-forest-900/40 bg-slate-900/20 p-4">
            <div className="flex items-center justify-between border-b border-forest-900/10 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-400" />
                Geotag Coordinates
              </span>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Fetch GPS Geolocation
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-500">Latitude</label>
                <input
                  type="number"
                  step="0.00001"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full rounded border border-forest-900 bg-slate-950 px-3 py-1.5 text-slate-300 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500">Longitude</label>
                <input
                  type="number"
                  step="0.00001"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full rounded border border-forest-900 bg-slate-950 px-3 py-1.5 text-slate-300 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-500">Descriptive Location Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., Beside green bin, High Park woodland pathway"
                className="w-full rounded border border-forest-900 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-300">Description of Incident & Ecosystem Risk</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context regarding volume, waste elements, and proximity to water sources or vulnerable species nesting grounds..."
              className="w-full rounded-lg border border-forest-900 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none resize-none"
            />
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="border-t border-slate-900 pt-6 flex justify-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 disabled:cursor-not-allowed px-6 py-3 text-sm font-bold text-white transition-all shadow-md shadow-emerald-500/10 active:scale-[0.98]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Logging Incident...</span>
            </>
          ) : (
            <span>Log Environmental Incident</span>
          )}
        </button>
      </div>
    </form>
  );
};
