// Basic test script for Twilio Verify
require('dotenv').config({ path: '.env.local' });
const twilio = require('twilio');

console.log('=== Twilio Verify API Test ===');

// Get environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

// Mask credentials for logging
const maskStr = (str) => str ? `${str.substring(0, 4)}...${str.substring(str.length - 4)}` : 'not set';

// Log the environment variables (masked)
console.log('Account SID:', maskStr(accountSid));
console.log('Auth Token:', maskStr(authToken));
console.log('Verify Service SID:', maskStr(serviceSid));

// Initialize Twilio client
let client;
try {
  client = twilio(accountSid, authToken);
  console.log('Twilio client initialized');
} catch (error) {
  console.error('Error initializing Twilio client:', error);
  process.exit(1);
}

async function testTwilioVerify() {
  // First, check if service exists
  try {
    console.log('\nChecking Verify service...');
    const service = await client.verify.v2.services(serviceSid).fetch();
    console.log('✅ Service found:', {
      sid: service.sid,
      friendlyName: service.friendlyName,
      codeLength: service.codeLength
    });
    
    // Service exists, now send a test verification
    console.log('\nSending test verification code...');
    // Use a test phone number - Change this to a real number for actual testing
    const testPhone = "+15005550006"; // This is Twilio's test number
    
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications
      .create({
        to: testPhone,
        channel: "sms"
      });
    
    console.log('✅ Verification sent:', {
      sid: verification.sid,
      status: verification.status
    });
    
    return true;
  } catch (error) {
    console.error('❌ Twilio API Error:', {
      code: error.code,
      message: error.message,
      status: error.status || 'unknown'
    });
    
    // Provide better error messages based on error codes
    if (error.code === 20003) {
      console.error('\nAuthentication failed: Your Account SID or Auth Token is incorrect');
      console.error('Please double-check your TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env.local');
    } else if (error.code === 20404) {
      console.error('\nService not found: The TWILIO_VERIFY_SERVICE_SID is invalid');
      console.error('Please check if the service exists in your Twilio console');
    }
    
    return false;
  }
}

// Run the test
testTwilioVerify()
  .then(success => {
    console.log('\n============================');
    console.log(success ? '✅ Test completed successfully!' : '❌ Test failed!');
    console.log('============================');
  })
  .catch(error => {
    console.error('Unexpected error:', error);
  }); 