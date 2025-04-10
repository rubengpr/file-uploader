import { createClient } from '@supabase/supabase-js';

const jwtToken = localStorage.getItem('stoken');

const supabase = createClient(import.meta.env.VITE_SUPABASE_PROJECT_URL, import.meta.env.VITE_SUPABASE_API_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    }
  );

export default supabase;