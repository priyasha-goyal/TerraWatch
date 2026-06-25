import React, { useState } from 'react';
import { WASTE_TYPES, WASTE_TYPE_DETAILS } from '../../constants/status';
import type { Report } from '../../types';
import { Camera, MapPin, Loader2, Brain, AlertCircle, AlertTriangle } from 'lucide-react';
import { aiServiceShell, type AIDetectionResult } from '../../services/ai';

interface ReportFormProps {
  onSubmit: (report: Omit<Report, 'id' | 'reporterId' | 'createdAt' | 'updatedAt' | 'status'> & {
    aiConfidence?: number;
    imageFile?: File | null;
  }
  ) => void;
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIDetectionResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    // Show local image preview
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);

    setIsAnalyzing(true);
    setAiResult(null);
    setAiError(null);
    try {
      const result = await aiServiceShell.detectWaste(file);
      if (result) {
        setAiResult(result);
        if (result.suggestedTitle) setTitle(result.suggestedTitle);
        if (result.suggestedDescription) setDescription(result.suggestedDescription);
        setWasteType(result.wasteType as any);
        setSeverity(result.severity);
      } else {
        setAiError('Could not analyze image. Please fill in details manually.');
      }
    } catch {
      setAiError('Analysis failed. Please fill in details manually.');
    } finally {
      setIsAnalyzing(false);
    }
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
      imageFile,
      isAnonymous,
      aiConfidence: aiResult?.confidence,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Column - Image & AI Placeholder */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[#374151]">Incident Photograph Upload</label>

          <div className={`relative h-60 w-full rounded-xl border border-dashed border-[#CCDCD1] bg-[#FAFAF8] flex flex-col items-center justify-center overflow-hidden transition-all hover:border-[#2E7D32]/60 hover:bg-[#F5F7F5] ${isAnalyzing ? 'ring-2 ring-emerald-400 ring-offset-1 animate-pulse' : ''} ${aiResult ? 'ring-2 ring-emerald-500 ring-offset-1' : ''}`}>
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
                <Camera className="h-10 w-10 text-[#2E7D32] mb-3" />
                <span className="text-sm font-medium text-[#374151]">Choose file or drag & drop</span>
                <span className="text-xs text-[#6B7280] mt-1">Upload dump incident context image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>

          {imageUrl && (
            <>
              {isAnalyzing && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/20 p-4 text-xs text-emerald-700 flex items-center gap-2.5 animate-pulse">
                  <Brain className="h-5 w-5 text-emerald-500 animate-spin shrink-0" />
                  <span className="font-semibold">AI analyzing waste composition...</span>
                </div>
              )}

              {!isAnalyzing && aiResult && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-xs text-slate-750 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-700 text-sm">✅ AI Classification Complete</span>
                    <span className="inline-flex items-center rounded-full bg-amber-100 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                      {Math.round(aiResult.confidence * 100)}% Confidence
                    </span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <span className="font-semibold text-slate-500 block">Detected Items:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiResult.detectedItems.map((item, idx) => (
                        <span key={idx} className="bg-slate-200/60 border border-slate-300/30 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-white/40 border border-slate-200/20 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 text-amber-800 font-semibold mb-1">
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                      <span>Ecological Threat:</span>
                    </div>
                    <p className="italic text-slate-650 leading-relaxed">{aiResult.ecologicalThreatNotes}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/30">
                    <p className="text-slate-600 font-semibold">
                      <strong>AI Summary:</strong> {WASTE_TYPE_DETAILS[aiResult.wasteType as keyof typeof WASTE_TYPES]?.label || aiResult.wasteType} waste detected. Severity: {aiResult.severity}.
                    </p>
                  </div>

                  <p className="text-[10px] text-slate-400 italic">
                    ⚡ Form auto-filled — review and adjust if needed
                  </p>
                </div>
              )}

              {!isAnalyzing && aiError && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/20 p-4 text-xs text-amber-850 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-700">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                    <span>Analysis Notice</span>
                  </div>
                  <p className="text-amber-700 font-medium">{aiError}</p>
                  <p className="text-[10px] text-slate-400">Please fill in the form fields manually</p>
                </div>
              )}

              {!isAnalyzing && !aiResult && !aiError && (
                <div className="rounded-xl border border-[#E5EDE8] bg-[#FAFAF8] p-4 text-xs text-[#6B7280]">
                  <p className="font-semibold text-[#374151] mb-1">OpenAI Vision Triage Placeholder</p>
                  <p className="text-[#6B7280]">Image uploaded successfully. Real-time vision-based classification and composition analysis will run automatically upon backend integration.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Column - Inputs */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#374151]">Incident Heading / Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Plastic heap blocking local creek trail"
              className="w-full rounded-lg border border-[#CCDCD1] bg-white px-4 py-2.5 text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#374151]">Waste Classification</label>
              <select
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value as keyof typeof WASTE_TYPES)}
                className="w-full rounded-lg border border-[#CCDCD1] bg-white px-3 py-2.5 text-sm text-[#1F2937] focus:border-[#2E7D32] focus:outline-none transition-all"
              >
                {Object.entries(WASTE_TYPES).map(([key, val]) => (
                  <option key={key} value={val} className="text-[#1F2937]">
                    {WASTE_TYPE_DETAILS[val].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#374151]">Severity Rating</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Report['severity'])}
                className="w-full rounded-lg border border-[#CCDCD1] bg-white px-3 py-2.5 text-sm text-[#1F2937] focus:border-[#2E7D32] focus:outline-none transition-all"
              >
                <option value="LOW" className="text-emerald-700">LOW - Minor debris</option>
                <option value="MEDIUM" className="text-amber-700">MEDIUM - Clear ecological risk</option>
                <option value="HIGH" className="text-orange-700">HIGH - Large/Toxic heap</option>
                <option value="CRITICAL" className="text-rose-700">CRITICAL - Chemical spill/habitat blocked</option>
              </select>
            </div>
          </div>

          {/* Location details */}
          <div className="space-y-3 rounded-lg border border-[#E5EDE8] bg-[#FAFAF8] p-4">
            <div className="flex items-center justify-between border-b border-[#E5EDE8] pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4B5563] flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#2E7D32]" />
                Geotag Coordinates
              </span>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="text-xs font-semibold text-[#2E7D32] hover:text-[#1B5E20] transition-colors"
              >
                Fetch GPS Geolocation
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-[#6B7280]">Latitude</label>
                <input
                  type="number"
                  step="0.00001"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full rounded border border-[#CCDCD1] bg-white px-3 py-1.5 text-xs text-[#1F2937] focus:border-[#2E7D32] focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#6B7280]">Longitude</label>
                <input
                  type="number"
                  step="0.00001"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full rounded border border-[#CCDCD1] bg-white px-3 py-1.5 text-xs text-[#1F2937] focus:border-[#2E7D32] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#6B7280]">Descriptive Location Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., Beside green bin, High Park woodland pathway"
                className="w-full rounded border border-[#CCDCD1] bg-white px-3 py-1.5 text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:border-[#2E7D32] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4"
            />

            <label className="text-sm text-[#374151]">
              Report Anonymously
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#374151]">Description of Incident & Ecosystem Risk</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context regarding volume, waste elements, and proximity to water sources or vulnerable species nesting grounds..."
              className="w-full rounded-lg border border-[#CCDCD1] bg-white px-4 py-2.5 text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] focus:outline-none resize-none transition-all"
            />
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="border-t border-[#E5EDE8] pt-6 flex justify-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#2E7D32] hover:bg-[#1B5E20] disabled:bg-[#2E7D32]/50 disabled:cursor-not-allowed px-6 py-3 text-sm font-bold text-white transition-all shadow-sm active:scale-[0.98]"
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
