import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('[Supabase] Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
