'use client';

import { createClient } from '@supabase/supabase-js';

// Get environment variables from .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verify that we have the required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Missing Supabase environment variables!');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'set' : 'missing');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'set' : 'missing');
  
  if (typeof window !== 'undefined') {
    console.log('Browser environment detected, environment variables may not be accessible.');
  }
}

// For debugging (mask the key for security)
const maskKey = (key) => {
  if (!key) return 'not set';
  return key.substring(0, 6) + '...' + key.substring(key.length - 4);
};

console.log('Initializing Supabase client with:');
console.log('URL:', supabaseUrl || 'not set');
console.log('Key:', maskKey(supabaseAnonKey));

// Provide fallback values for development only (not production)
// You can remove this in production
const devFallbackUrl = 'https://tjiyaswdbuvmeqilhqca.supabase.co';
const devFallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqaXlhc3dkYnV2bWVxaWxocWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MzU0NTYsImV4cCI6MjA1OTUxMTQ1Nn0.IWrkrMBxO54N8jhlBEYI-0TPaLfV8y1qUUhi22zw7e8';

// Use environment variables or fallbacks for development
const url = supabaseUrl || devFallbackUrl;
const key = supabaseAnonKey || devFallbackKey;

// Create a supabase client
export const supabase = createClient(
  url,
  key,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

// Helper function to check Supabase connection
export const checkSupabaseConnection = async () => {
  try {
    console.log('Checking Supabase connection...');
    console.log('Using URL:', url);
    console.log('Using Key:', maskKey(key));
    
    // Test query to check if connection works
    const { data, error } = await supabase
      .from('locations')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      
      // Provide more specific error information
      if (error.message.includes('invalid API key')) {
        console.error('This usually means:');
        console.error('1. Your NEXT_PUBLIC_SUPABASE_ANON_KEY is incorrect');
        console.error('2. The key might not be properly loaded from .env.local');
        console.error('3. Your project might be disabled or deleted on Supabase');
      }
      
      if (error.message.includes('connection refused') || error.message.includes('network')) {
        console.error('This usually means:');
        console.error('1. Your NEXT_PUBLIC_SUPABASE_URL is incorrect');
        console.error('2. Your network connection might be interrupted');
      }
      
      return false;
    }
    
    console.log('Supabase connection successful!');
    return true;
  } catch (err) {
    console.error('Error checking Supabase connection:', err);
    return false;
  }
}; 