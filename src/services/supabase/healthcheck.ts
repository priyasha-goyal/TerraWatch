import { supabase } from './client';

export async function checkSupabaseConnection() {
  const { error } = await supabase
    .from('reports')
    .select('*')
    .limit(1);

  return {
    success: !error,
    error: error?.message,
  };
}