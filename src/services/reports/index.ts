import type { Report, CleanupLog } from '../../types';
import type { ReportStatus } from '../../constants/status';

/**
 * Reports Service Integration Shell
 * 
 * Future Integration Plan:
 * 1. Read/Write from Supabase `reports` and `cleanup_logs` tables
 * 2. Hook up subscriptions for real-time dashboard updates
 */

const SAMPLE_REPORTS: Report[] = [
  {
    id: 'rep-101',
    reporterId: 'usr-google-101',
    reporterName: 'Eco Volunteer',
    title: 'Plastic Bottle Accumulation near Shoreline',
    description: 'Over 50 discarded plastic bottles and packaging materials floating on the shoreline, threatening local wildlife.',
    wasteType: 'PLASTIC',
    severity: 'MEDIUM',
    latitude: 43.64532,
    longitude: -79.37812,
    address: 'High Park Shoreline, Toronto, ON',
    imageUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&auto=format&fit=crop&q=80',
    status: 'INVESTIGATING',
    aiConfidence: 0.94,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rep-102',
    reporterId: 'usr-google-102',
    reporterName: 'Sanitation Watcher',
    title: 'Illegal Chemical Drum Disposal',
    description: 'Two large steel drums containing industrial solvents dumped off the main trail. Casings show active leaks.',
    wasteType: 'CHEMICAL',
    severity: 'CRITICAL',
    latitude: 43.66782,
    longitude: -79.41245,
    address: 'Cedarvale Park Trail, Toronto, ON',
    imageUrl: 'https://images.unsplash.com/photo-1605600656308-972a4e843af0?w=600&auto=format&fit=crop&q=80',
    status: 'CLEANUP_SCHEDULED',
    aiConfidence: 0.88,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const SAMPLE_CLEANUP_LOGS: CleanupLog[] = [
  {
    id: 'cln-201',
    reportId: 'rep-103',
    reportTitle: 'Don Valley Construction Waste Clearance',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    volunteersCount: 12,
    wasteCollectedKg: 450,
    description: 'Volunteers cleared discarded tires and concrete blocks. Habitat restore complete.',
  }
];

export const reportsServiceShell = {
  getReports: async (): Promise<Report[]> => {
    console.log('Reports Service: Fetching incident reports placeholder...');
    return SAMPLE_REPORTS;
  },
  
  createReport: async (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Report> => {
    console.log('Reports Service: Submitting new report placeholder...', reportData);
    return {
      ...reportData,
      id: `rep-${Math.random().toString(36).substring(2, 11)}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
  
  updateReportStatus: async (reportId: string, status: ReportStatus): Promise<boolean> => {
    console.log(`Reports Service: Updating report ${reportId} status to ${status} placeholder`);
    return true;
  },
  
  getCleanupLogs: async (): Promise<CleanupLog[]> => {
    console.log('Reports Service: Fetching cleanup activity logs placeholder...');
    return SAMPLE_CLEANUP_LOGS;
  },
  
  createCleanupLog: async (logData: Omit<CleanupLog, 'id'>): Promise<CleanupLog> => {
    console.log('Reports Service: Logging cleanup session placeholder...', logData);
    return {
      ...logData,
      id: `cln-${Math.random().toString(36).substring(2, 11)}`,
    };
  }
};
