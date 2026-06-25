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

      isAnonymous: report.is_anonymous,
      upvotes: report.upvotes ?? 0,
      falseReports: report.false_reports ?? 0,

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

  getMyReports: async (): Promise<Report[]> => {

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return [];
    }

    return (data || []).map((report) => ({
      id: report.id,
      reporterId: report.user_id,

      isAnonymous: report.is_anonymous,
      upvotes: report.upvotes ?? 0,
      falseReports: report.false_reports ?? 0,

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
      aiConfidence?: number;
    }
  ): Promise<Report> => {

    console.log("CREATE REPORT STARTED");

    const {
      data: { user }
    } = await supabase.auth.getUser();
    console.log("Supabase user:", user);

    let imageUrl: string | null = null;

    if (reportData.imageFile) {
      imageUrl = await uploadReportImage(reportData.imageFile);
    }

    const aiSummary = reportData.aiConfidence 
      ? `${reportData.wasteType} waste detected. Severity: ${reportData.severity}. Confidence: ${Math.round(reportData.aiConfidence * 100)}%. ${reportData.description}`
      : null;

    const { data, error } = await supabase
      .from('reports')
      .insert({
        user_id: user?.id,
        title: reportData.title,
        description: reportData.description,
        image_url: imageUrl,
        latitude: reportData.latitude,
        longitude: reportData.longitude,
        waste_type: reportData.wasteType,
        severity: reportData.severity,
        is_anonymous: reportData.isAnonymous ?? true,
        ai_summary: aiSummary,
        status: 'PENDING'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

if (user) {
  await supabase.rpc('add_eco_coins', {
    user_id_input: user.id,
    amount_input: 10
  });

  await supabase.from('eco_coin_transactions').insert({
    user_id: user.id,
    report_id: data.id,
    amount: 10,
    reason: 'Report submitted'
  });
}

    return {
      id: data.id,
      reporterId: data.user_id,

      isAnonymous: data.is_anonymous,
      upvotes: data.upvotes ?? 0,
      falseReports: data.false_reports ?? 0,

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

  updateReportStatus: async (
    reportId: string,
    status: ReportStatus
  ): Promise<boolean> => {

    const { error } = await supabase
      .from('reports')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId);

    if (error) {
      console.error(error);
      return false;
    }

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

  },
  subscribeToReports: (callback: () => void) => {
    return supabase
      .channel('reports-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reports'
        },
        () => {
          callback();
        }
      )
      .subscribe();
  },

};
