import { createClient } from '@supabase/supabase-js';

const createSupabaseClientWithAuth = (stoken: string) => {
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

export default createSupabaseClientWithAuth;