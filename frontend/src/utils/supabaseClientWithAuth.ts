import { createClient } from '@supabase/supabase-js';

export const createSupabaseClientWithAuth = (stoken: string) => {
  return createClient(
    import.meta.env.VITE_SUPABASE_PROJECT_URL,
    import.meta.env.VITE_SUPABASE_API_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${stoken}`,
        },
      },
    }
  );
};