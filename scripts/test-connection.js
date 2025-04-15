// Script to test Supabase connection
const { supabase, checkSupabaseConnection } = require('../lib/supabase/client-cjs');
const fs = require('fs');
const path = require('path');

// Mask API key for security when logging
function maskKey(key) {
  if (!key || typeof key !== 'string') return 'invalid or not set';
  return key.substring(0, 6) + '...' + key.substring(key.length - 4);
}

// Check if .env.local file exists and contains required variables
function checkEnvFile() {
  console.log('Checking environment variables setup...');
  
  // Path to .env.local in the project root
  const envPath = path.join(process.cwd(), '.env.local');
  
  try {
    if (!fs.existsSync(envPath)) {
      console.error('❌ .env.local file not found!');
      console.log('Create this file in your project root with the following content:');
      console.log(`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
      `);
      return false;
    }
    
    console.log('✅ .env.local file exists');
    
    // Read file content
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check for Supabase URL
    const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=');
    console.log(hasSupabaseUrl 
      ? '✅ NEXT_PUBLIC_SUPABASE_URL is defined in .env.local' 
      : '❌ NEXT_PUBLIC_SUPABASE_URL is missing from .env.local');
    
    // Check for Supabase key
    const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=');
    console.log(hasSupabaseKey 
      ? '✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is defined in .env.local' 
      : '❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing from .env.local');
    
    return hasSupabaseUrl && hasSupabaseKey;
  } catch (err) {
    console.error('Error checking .env.local file:', err);
    return false;
  }
}

// Check environment variables in Node.js
function checkNodeEnv() {
  console.log('\nChecking Node.js environment variables...');
  
  // Check if the variables are accessible
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('NEXT_PUBLIC_SUPABASE_URL:', url ? `✅ set (${url})` : '❌ not set');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', key ? `✅ set (${maskKey(key)})` : '❌ not set');
  
  return !!url && !!key;
}

// Test Supabase direct connection
async function testDirectConnection() {
  console.log('\nTesting direct Supabase connection...');
  
  try {
    const { data, error } = await supabase.from('locations').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Direct connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Direct connection test successful');
    return true;
  } catch (err) {
    console.error('❌ Direct connection test failed with exception:', err.message);
    return false;
  }
}

// Main test function
async function testSupabaseConnection() {
  console.log('=== Supabase Connection Test ===\n');
  
  // Step 1: Check .env.local file
  const envFileOk = checkEnvFile();
  
  // Step 2: Check environment variables in Node.js
  const nodeEnvOk = checkNodeEnv();
  
  // Step 3: Test Supabase connection
  const isConnected = await checkSupabaseConnection();
  console.log(isConnected 
    ? '\n✅ Supabase connection check PASSED'
    : '\n❌ Supabase connection check FAILED');
  
  // Step 4: Test direct connection
  const directConnectionOk = await testDirectConnection();
  
  // Overall assessment
  console.log('\n=== Test Summary ===');
  console.log('Environment file check:', envFileOk ? '✅ PASSED' : '❌ FAILED');
  console.log('Node.js environment check:', nodeEnvOk ? '✅ PASSED' : '❌ FAILED');
  console.log('Supabase connection check:', isConnected ? '✅ PASSED' : '❌ FAILED');
  console.log('Direct connection test:', directConnectionOk ? '✅ PASSED' : '❌ FAILED');
  
  if (!isConnected || !directConnectionOk) {
    console.log('\n=== Troubleshooting ===');
    console.log('1. Double-check your Supabase URL and anon key in .env.local');
    console.log('2. Verify your Supabase project is active in the Supabase dashboard');
    console.log('3. Make sure your IP is not blocked by Supabase');
    console.log('4. If using a database password, ensure it is correct');
    console.log('5. Make sure the required tables exist in your Supabase project');
  }
  
  return isConnected && directConnectionOk;
}

// Run the test
testSupabaseConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ All tests passed! Your Supabase connection is working correctly.');
    } else {
      console.log('\n❌ Some tests failed. Please check the issues above.');
    }
  })
  .catch(err => {
    console.error('Error running tests:', err);
  }); 