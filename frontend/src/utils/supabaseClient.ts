import { createClient } from '@supabase/supabase-js';

const getSupabaseClient = () => {
  const stoken = localStorage.getItem('stoken');
  
  return createClient(
    import.meta.env.VITE_SUPABASE_PROJECT_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_API_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${stoken}`,
        },
      },
    }
  );
};

export default getSupabaseClient;