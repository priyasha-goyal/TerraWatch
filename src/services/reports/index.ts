import { supabase } from '../supabase/client';
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

const uploadReportImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;

  const { error } = await supabase.storage
    .from('report-images')
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from('report-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

export const reportsServiceShell = {
  getReports: async (): Promise<Report[]> => {
    
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data || []).map((report) => ({
    id: report.id,
    reporterId: report.user_id,
    title: report.title,
    description: report.description,
    wasteType: report.waste_type,
    severity: report.severity,
    latitude: report.latitude,
    longitude: report.longitude,
    address: '',
    imageUrl: report.image_url,
    status: report.status,
    createdAt: report.created_at,
    updatedAt: report.updated_at,
  }));
},
  
  createReport: async (
  reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
    imageFile?: File | null;
  }
): Promise<Report> => {
  let imageUrl: string | null = null;

if (reportData.imageFile) {
  imageUrl = await uploadReportImage(reportData.imageFile);
}

  const { data, error } = await supabase
    .from('reports')
    .insert({
      user_id: null,
      title: reportData.title,
      description: reportData.description,
      image_url: imageUrl,
      latitude: reportData.latitude,
      longitude: reportData.longitude,
      waste_type: reportData.wasteType,
      severity: reportData.severity,
      ai_summary: null,
      status: 'PENDING'
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    reporterId: data.user_id,
    reporterName: reportData.reporterName,
    title: data.title,
    description: data.description,
    wasteType: data.waste_type,
    severity: data.severity,
    latitude: data.latitude,
    longitude: data.longitude,
    address: '',
    imageUrl: data.image_url,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
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
