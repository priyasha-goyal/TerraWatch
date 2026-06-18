import type { ImpactMetrics } from '../../types';

/**
 * Biodiversity Service Integration Shell
 * 
 * Future Integration Plan:
 * 1. Fetch conservation lists from global species databases (e.g., IUCN Red List, GBIF API)
 * 2. Calculate impact factors based on types of waste removed and surrounding species overlap
 * 3. Supply dashboards with real-time ecological health scores
 */

export interface SpeciesObservation {
  id: string;
  name: string;
  scientificName: string;
  status: string;
  count: number;
  observedDate: string;
}

export const biodiversityServiceShell = {
  getEcosystemMetrics: async (): Promise<ImpactMetrics> => {
    console.log('Biodiversity Service: Fetching ecosystem metrics placeholder...');
    return {
      totalReports: 2,
      resolvedReports: 1,
      totalWasteRemovedKg: 450,
      activeVolunteers: 12,
      biodiversityScore: 78,
      ecoCoinsRewarded: 250,
    };
  },
  
  getProtectedSpeciesNearby: async (lat: number, lng: number): Promise<SpeciesObservation[]> => {
    console.log(`Biodiversity Service: Checking protected species surrounding coordinates (${lat}, ${lng}) placeholder...`);
    return [];
  }
};
