// Check environment variables for any obvious issues
require('dotenv').config({ path: '.env.local' });

// Check if variables exist and display character counts
const vars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_VERIFY_SERVICE_SID'
];

console.log('=== Environment Variables Check ===\n');

vars.forEach(varName => {
  const value = process.env[varName];
  
  console.log(`${varName}:`);
  
  if (!value) {
    console.log('  ❌ NOT SET');
  } else {
    console.log(`  ✅ SET (${value.length} characters)`);
    
    // Check for common issues
    if (value.includes('"') || value.includes("'")) {
      console.log('  ⚠️ WARNING: Contains quote characters that might cause issues');
    }
    
    if (value.startsWith(' ') || value.endsWith(' ')) {
      console.log('  ⚠️ WARNING: Contains leading or trailing spaces');
    }
    
    if (varName.includes('SID') && !value.startsWith('AC') && varName === 'TWILIO_ACCOUNT_SID') {
      console.log('  ⚠️ WARNING: Twilio Account SID should typically start with "AC"');
    }
    
    if (varName === 'TWILIO_VERIFY_SERVICE_SID' && !value.startsWith('VA')) {
      console.log('  ⚠️ WARNING: Twilio Verify Service SID should typically start with "VA"');
    }
    
    // Print first and last few characters
    const firstChars = value.substring(0, 10);
    const lastChars = value.substring(value.length - 5);
    console.log(`  Preview: ${firstChars}...${lastChars}`);
  }
  
  console.log('');
});

// Try a basic API format check
try {
  const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Supabase URL format: ✅ Valid URL');
  console.log(`  Protocol: ${supabaseUrl.protocol}`);
  console.log(`  Hostname: ${supabaseUrl.hostname}`);
  console.log(`  Path: ${supabaseUrl.pathname}`);
} catch (e) {
  console.log('Supabase URL format: ❌ Invalid URL format');
  console.log(`  Error: ${e.message}`);
}

// Check JWT format for Supabase keys
function checkJWT(name, token) {
  if (!token) return;
  
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.log(`${name}: ❌ Does not appear to be a valid JWT (should have 3 parts separated by dots)`);
    return;
  }
  
  try {
    // Try to decode the header
    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
    console.log(`${name}: ✅ Valid JWT format`);
    console.log(`  Algorithm: ${header.alg}`);
    console.log(`  Type: ${header.typ}`);
    
    // Try to decode the payload
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      console.log(`  Expires: ${expDate.toISOString()} (${payload.exp})`);
      
      if (expDate < new Date()) {
        console.log('  ⚠️ WARNING: This token appears to be expired!');
      }
    }
  } catch (e) {
    console.log(`${name}: ⚠️ Could not parse JWT contents`);
    console.log(`  Error: ${e.message}`);
  }
}

console.log('\n=== API Key Format Checks ===\n');
checkJWT('Supabase Anon Key', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
checkJWT('Supabase Service Role Key', process.env.SUPABASE_SERVICE_ROLE_KEY); 