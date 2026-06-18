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
    badgeClass: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    textClass: 'text-yellow-400',
  },
  [REPORT_STATUS.INVESTIGATING]: {
    label: 'Under Investigation',
    badgeClass: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    textClass: 'text-blue-400',
  },
  [REPORT_STATUS.CLEANUP_SCHEDULED]: {
    label: 'Cleanup Scheduled',
    badgeClass: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    textClass: 'text-purple-400',
  },
  [REPORT_STATUS.RESOLVED]: {
    label: 'Resolved & Restored',
    badgeClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    textClass: 'text-emerald-400',
  },
  [REPORT_STATUS.REJECTED]: {
    label: 'Duplicate / Rejected',
    badgeClass: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
    textClass: 'text-slate-400',
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
