import type { ReportStatus, WasteType } from '../constants/status';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'MUNICIPALITY' | 'ADMIN';
  avatarUrl?: string;
  ecoCoinBalance: number;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName?: string;
  title: string;
  description: string;
  wasteType: WasteType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  latitude: number;
  longitude: number;
  address: string;
  imageUrl?: string;
  status: ReportStatus;
  aiConfidence?: number; // 0 to 1
  aiClassifiedType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CleanupLog {
  id: string;
  reportId: string;
  reportTitle: string;
  date: string;
  volunteersCount: number;
  wasteCollectedKg: number;
  description: string;
  afterImageUrl?: string;
}

export interface EcoCoin {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  createdAt: string;
}

export interface ImpactMetrics {
  totalReports: number;
  resolvedReports: number;
  totalWasteRemovedKg: number;
  activeVolunteers: number;
  biodiversityScore: number; // 0 to 100 index
  ecoCoinsRewarded: number;
}
