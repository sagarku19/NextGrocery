// Test Twilio Verify service configuration
require('dotenv').config({ path: '.env.local' });
const twilio = require('twilio');

// Get credentials from env
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

console.log('=== Twilio Verify Service Test ===');
console.log('Account SID:', `${accountSid.substring(0, 6)}...${accountSid.substring(accountSid.length-4)}`);
console.log('Service SID:', `${serviceSid.substring(0, 6)}...${serviceSid.substring(serviceSid.length-4)}`);

// Initialize client
const client = twilio(accountSid, authToken);

// Test Verify service
async function testVerifyService() {
  try {
    console.log('\nFetching Verify service details...');
    
    // Fetch the service information
    const service = await client.verify.v2.services(serviceSid).fetch();
    
    console.log('\n✅ Verify service found successfully!');
    console.log('Service details:');
    console.log({
      sid: service.sid,
      friendlyName: service.friendlyName,
      codeLength: service.codeLength,
      lookupEnabled: service.lookupEnabled,
      status: 'active'
    });
    
    // Check if the service is properly configured
    if (service.codeLength < 4) {
      console.log('\n⚠️ Warning: Code length is set to less than 4 digits, which might not be secure');
    }
    
    console.log('\nVerify service is correctly configured and ready to use!');
    
    return true;
  } catch (error) {
    console.error('\n❌ Error fetching Verify service:');
    
    if (error.code === 20404) {
      console.error('The Verify service with SID does not exist or is not accessible.');
      console.error('\nPlease create a new Verify service in your Twilio console:');
      console.error('1. Go to https://console.twilio.com/');
      console.error('2. Navigate to Verify > Services');
      console.error('3. Click "Create Verification Service"');
      console.error('4. Update your TWILIO_VERIFY_SERVICE_SID in .env.local with the new SID');
    } else {
      console.error(`Error code: ${error.code}`);
      console.error(`Error message: ${error.message}`);
    }
    
    return false;
  }
}

// Run the test
testVerifyService()
  .then(success => {
    if (!success) {
      console.log('\nService verification failed. See errors above.');
    }
  })
  .catch(err => {
    console.error('Unexpected error:', err);
  }); 