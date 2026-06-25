import { supabase } from '../supabase/client';

export const upvotesService = {
  addUpvote: async (reportId: string, userId: string): Promise<void> => {
    const { error } = await supabase
      .from('report_upvotes')
      .insert({ report_id: reportId, user_id: userId });

    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation (already upvoted)
        return;
      }
      throw error;
    }

    // Insert succeeded, award coins and log transaction
    await supabase.rpc('add_eco_coins', {
      user_id_input: userId,
      amount_input: 2
    });

    await supabase.from('eco_coin_transactions').insert({
      user_id: userId,
      report_id: reportId,
      amount: 2,
      reason: 'Community validation'
    });
  },

  removeUpvote: async (reportId: string, userId: string): Promise<void> => {
    const { error } = await supabase
      .from('report_upvotes')
      .delete()
      .eq('report_id', reportId)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }
  },

  batchFetchUpvotes: async (currentUserId: string | null): Promise<Map<string, { count: number; hasUpvoted: boolean }>> => {
    const { data, error } = await supabase
      .from('report_upvotes')
      .select('*');

    if (error) {
      console.error('Error batch fetching upvotes:', error);
      return new Map();
    }

    const upvoteMap = new Map<string, { count: number; hasUpvoted: boolean }>();

    if (data) {
      data.forEach((row: any) => {
        const rId = row.report_id;
        const uId = row.user_id;

        if (!upvoteMap.has(rId)) {
          upvoteMap.set(rId, { count: 0, hasUpvoted: false });
        }

        const current = upvoteMap.get(rId)!;
        current.count += 1;
        if (currentUserId && uId === currentUserId) {
          current.hasUpvoted = true;
        }
      });
    }

    return upvoteMap;
  },

  getValidatorLeaderboard: async (): Promise<{ userId: string; name: string; validationCount: number }[]> => {
    const { data: upvotes, error: upvotesError } = await supabase
      .from('report_upvotes')
      .select('user_id');

    if (upvotesError || !upvotes) {
      console.error('Error fetching upvotes for leaderboard:', upvotesError);
      return [];
    }

    // Group by user_id and count in JS
    const countsMap = new Map<string, number>();
    upvotes.forEach((row: any) => {
      const uid = row.user_id;
      countsMap.set(uid, (countsMap.get(uid) || 0) + 1);
    });

    // Sort by count DESC and take top 5
    const top5 = Array.from(countsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (top5.length === 0) {
      return [];
    }

    const userIds = top5.map(([userId]) => userId);

    // Join with profiles (separate query for names)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error fetching profiles for leaderboard:', profilesError);
    }

    const profileMap = new Map<string, string>();
    if (profiles) {
      profiles.forEach((p: any) => {
        profileMap.set(p.id, p.full_name);
      });
    }

    const anonymizeName = (fullName: string) => {
      if (!fullName) return 'Anonymous Citizen';
      const parts = fullName.trim().split(/\s+/);
      if (parts.length === 0) return 'Anonymous Citizen';
      if (parts.length === 1) return parts[0];
      const firstName = parts[0];
      const lastInitial = parts[parts.length - 1][0];
      return `${firstName} ${lastInitial}.`;
    };

    return top5.map(([userId, count]) => {
      const rawName = profileMap.get(userId) || 'Anonymous Citizen';
      return {
        userId,
        name: anonymizeName(rawName),
        validationCount: count
      };
    });
  }
};
