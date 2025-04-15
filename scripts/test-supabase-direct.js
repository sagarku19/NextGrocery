// Direct test of Supabase connectivity
const https = require('https');
require('dotenv').config({ path: '.env.local' });

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

console.log('=== Direct Supabase API Test ===\n');
console.log('URL:', supabaseUrl);

// Format URL without https:// prefix if it exists
const baseUrl = supabaseUrl.replace('https://', '');

// Simple function to make a GET request
function makeRequest(path, key) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: baseUrl,
      path: path,
      method: 'GET',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      // Log response status
      console.log('Status Code:', res.statusCode);
      console.log('Headers:', JSON.stringify(res.headers, null, 2));
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          // Try to parse as JSON
          const jsonData = JSON.parse(data);
          resolve({ statusCode: res.statusCode, body: jsonData });
        } catch (e) {
          // If not JSON, return as string
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('Error making request:', error.message);
      reject(error);
    });
    
    req.end();
  });
}

async function testSupabase() {
  try {
    console.log('\nTesting Supabase REST API health...');
    
    // Test 1: Call the REST API health endpoint
    const healthResult = await makeRequest('/rest/v1/', supabaseAnonKey);
    console.log('\nAPI Health Check Results:');
    console.log(JSON.stringify(healthResult, null, 2));
    
    if (healthResult.statusCode >= 200 && healthResult.statusCode < 300) {
      console.log('✅ Supabase REST API is healthy!');
    } else {
      console.log('❌ Supabase REST API health check failed with status', healthResult.statusCode);
      return false;
    }
    
    // Test 2: Try to list tables
    console.log('\nTrying to list tables...');
    const tablesResult = await makeRequest('/rest/v1/?exclude=spatial_ref_sys', supabaseAnonKey);
    console.log('Tables response status:', tablesResult.statusCode);
    
    if (tablesResult.statusCode >= 200 && tablesResult.statusCode < 300) {
      console.log('✅ Successfully retrieved tables!');
    } else {
      console.log('❌ Failed to retrieve tables with status', tablesResult.statusCode);
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}

// Run the test
testSupabase()
  .then(success => {
    if (success) {
      console.log('\n✅ Direct API test completed successfully.');
    } else {
      console.log('\n❌ Direct API test failed. See errors above.');
    }
  })
  .catch(err => {
    console.error('Fatal error:', err);
  }); 