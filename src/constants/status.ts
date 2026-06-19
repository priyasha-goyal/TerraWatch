export const REPORT_STATUS = {
  PENDING: 'PENDING',
  INVESTIGATING: 'INVESTIGATING',
  CLEANUP_SCHEDULED: 'CLEANUP_SCHEDULED',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
} as const;

export type ReportStatus = typeof REPORT_STATUS[keyof typeof REPORT_STATUS];

export const STATUS_DETAILS: Record<ReportStatus, { label: string; badgeClass: string; textClass: string }> = {
  [REPORT_STATUS.PENDING]: {
    label: 'Pending Review',
    badgeClass: 'bg-amber-50 border-amber-200 text-amber-600',
    textClass: 'text-amber-600',
  },
  [REPORT_STATUS.INVESTIGATING]: {
    label: 'Under Investigation',
    badgeClass: 'bg-blue-50 border-blue-200 text-blue-600',
    textClass: 'text-blue-600',
  },
  [REPORT_STATUS.CLEANUP_SCHEDULED]: {
    label: 'Cleanup Scheduled',
    badgeClass: 'bg-purple-50 border-purple-200 text-purple-600',
    textClass: 'text-purple-600',
  },
  [REPORT_STATUS.RESOLVED]: {
    label: 'Resolved & Restored',
    badgeClass: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    textClass: 'text-emerald-600',
  },
  [REPORT_STATUS.REJECTED]: {
    label: 'Duplicate / Rejected',
    badgeClass: 'bg-slate-100 border-slate-200 text-slate-500',
    textClass: 'text-slate-500',
  },
};

export const WASTE_TYPES = {
  PLASTIC: 'PLASTIC',
  CHEMICAL: 'CHEMICAL',
  E_WASTE: 'E_WASTE',
  CONSTRUCTION: 'CONSTRUCTION',
  ORGANIC: 'ORGANIC',
  HAZARDOUS: 'HAZARDOUS',
  OTHER: 'OTHER',
} as const;

export type WasteType = typeof WASTE_TYPES[keyof typeof WASTE_TYPES];

export const WASTE_TYPE_DETAILS: Record<WasteType, { label: string; severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' }> = {
  [WASTE_TYPES.PLASTIC]: { label: 'Plastic & General Waste', severity: 'MEDIUM' },
  [WASTE_TYPES.CHEMICAL]: { label: 'Chemicals / Liquid Dumping', severity: 'CRITICAL' },
  [WASTE_TYPES.E_WASTE]: { label: 'Electronics & Batteries', severity: 'HIGH' },
  [WASTE_TYPES.CONSTRUCTION]: { label: 'Construction Debris', severity: 'LOW' },
  [WASTE_TYPES.ORGANIC]: { label: 'Organic / Green Waste', severity: 'LOW' },
  [WASTE_TYPES.HAZARDOUS]: { label: 'Hazardous / Medical Waste', severity: 'CRITICAL' },
  [WASTE_TYPES.OTHER]: { label: 'Other Unclassified', severity: 'MEDIUM' },
};
