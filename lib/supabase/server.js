import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    throw new Error('Missing Supabase environment variables');
  }

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    cookies: {
      get: (key) => {
        try {
          return cookies().get(key)?.value;
        } catch (error) {
          console.error('Error getting cookie:', error);
          return null;
        }
      },
      set: (key, value, options) => {
        try {
          cookies().set(key, value, options);
        } catch (error) {
          console.error('Error setting cookie:', error);
        }
      },
      remove: (key, options) => {
        try {
          cookies().delete(key, options);
        } catch (error) {
          console.error('Error removing cookie:', error);
        }
      },
    },
  });
} 