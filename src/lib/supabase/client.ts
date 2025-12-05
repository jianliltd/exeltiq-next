import { createClient } from '@supabase/supabase-js';

import { Database } from './types';

// const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>('http://127.0.0.1:54321', 'public', {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});