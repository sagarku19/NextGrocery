import twilio from 'twilio';

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function GET(req) {
  try {
    console.log('Creating a new Twilio Verify service...');
    
    // Create a new Verify service
    const service = await client.verify.v2.services.create({
      friendlyName: 'NextGrocery Verification Service',
      codeLength: 6
    });
    
    console.log('Service created successfully:', {
      sid: service.sid,
      friendlyName: service.friendlyName
    });

    return new Response(JSON.stringify({
      success: true,
      service: {
        sid: service.sid,
        friendlyName: service.friendlyName
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error creating Verify service:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 