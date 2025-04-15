// Simple script to test Supabase connection without requiring specific tables
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Mask API key for security when logging
function maskKey(key) {
  if (!key || typeof key !== 'string') return 'invalid or not set';
  return key.substring(0, 6) + '...' + key.substring(key.length - 4);
}

console.log('=== Simple Supabase Connection Test ===\n');
console.log('Using URL:', supabaseUrl);
console.log('Using Key:', maskKey(supabaseAnonKey));

// Create a supabase client
const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

async function testConnection() {
  try {
    console.log('\nChecking Supabase health...');
    
    // Simply try to get the service status - doesn't require any tables
    const { error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
    
    console.log('✅ Connection successful! Was able to reach Supabase API.');
    return true;
  } catch (err) {
    console.error('❌ Connection test failed with exception:', err);
    return false;
  }
}

// Run the test
testConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ Basic connection test passed!');
      console.log('If specific features are not working, you may need to:');
      console.log('1. Check if the required tables exist in your database');
      console.log('2. Verify your database permissions are set correctly');
      console.log('3. Ensure your project is on an active plan in Supabase');
    } else {
      console.log('\n❌ Connection test failed.');
      console.log('Please check:');
      console.log('1. Your Supabase URL and anon key in .env.local');
      console.log('2. Your Supabase project status (is it paused?)');
      console.log('3. Your network connection');
    }
  })
  .catch(err => {
    console.error('Error running test:', err);
  }); 