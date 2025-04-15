// Minimal Twilio authentication test
require('dotenv').config({ path: '.env.local' });
const twilio = require('twilio');

console.log('=== Simple Twilio Auth Test ===');

// Get environment variables exactly as they are in the file
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Examine the values carefully - looking for issues
console.log('Account SID length:', accountSid ? accountSid.length : 'not set');
console.log('Account SID format:', accountSid ? (accountSid.startsWith('AC') ? 'Valid' : 'Invalid') : 'N/A');
console.log('Auth Token length:', authToken ? authToken.length : 'not set');

// Check for invisible characters or trailing spaces
if (accountSid) {
  console.log('Account SID trimmed length:', accountSid.trim().length);
  if (accountSid.length !== accountSid.trim().length) {
    console.log('WARNING: Account SID contains leading or trailing whitespace!');
  }
}

if (authToken) {
  console.log('Auth Token trimmed length:', authToken.trim().length);
  if (authToken.length !== authToken.trim().length) {
    console.log('WARNING: Auth Token contains leading or trailing whitespace!');
  }
}

console.log('\nAttempting to authenticate with Twilio...');
console.log('Account SID (masked):', accountSid ? `${accountSid.substring(0, 6)}...${accountSid.substring(accountSid.length-4)}` : 'not set');

// Try creating the client
try {
  const client = twilio(accountSid, authToken);
  console.log('Client created successfully. Testing basic API call...');
  
  // Try a simple request
  client.api.accounts(accountSid).fetch()
    .then(account => {
      console.log('✅ Authentication successful!');
      console.log('Account details:', {
        sid: account.sid,
        friendlyName: account.friendlyName,
        status: account.status
      });
    })
    .catch(err => {
      console.error('❌ API call failed:', err.message);
      
      if (err.code === 20003) {
        console.error('\nYour Account SID or Auth Token is incorrect.');
        console.error('Possible issues:');
        console.error('1. The Account SID should start with "AC" and be exactly 34 characters');
        console.error('2. The Auth Token should be 32 characters');
        console.error('3. There might be invisible characters or spaces in your credentials');
        console.error('\nTry copying your credentials directly from the Twilio Console:');
        console.error('https://console.twilio.com/');
      }
    });
} catch (err) {
  console.error('❌ Failed to create client:', err.message);
} 