import { supabase } from '../supabase/client';

export interface AIDetectionResult {
  wasteType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  detectedItems: string[];
  ecologicalThreatNotes: string;
  suggestedTitle?: string;
  suggestedDescription?: string;
}

export const aiServiceShell = {
  detectWaste: async (imageFile: File): Promise<AIDetectionResult | null> => {
    try {
      const base64Promise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = () => {
          const resultStr = reader.result as string;
          const base64Data = resultStr.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = (error) => reject(error);
      });

      const imageBase64 = await base64Promise;
      const mimeType = imageFile.type;

      const { data, error } = await supabase.functions.invoke('classify-waste', {
        body: { imageBase64, mimeType }
      });

      if (error || !data) {
        console.error('Edge function classify-waste invocation error:', error);
        return null;
      }

      return data as AIDetectionResult;
    } catch (err) {
      console.error('AI detectWaste failed:', err);
      return null;
    }
  }
};
