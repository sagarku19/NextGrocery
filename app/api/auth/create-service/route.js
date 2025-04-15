import twilio from 'twilio';

// Initialize Twilio client
const client = twilio(
  'AC582c72c5cc2ff951d4462993a19ba7bc',
  '01051102127656cb364a81c0fe65e4ac'
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
      friendlyName: service.friendlyName,
      dateCreated: service.dateCreated
    });
    
    return new Response(
      JSON.stringify({
        success: true,
        serviceSid: service.sid,
        message: 'Verify service created successfully'
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating Verify service:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Failed to create Verify service',
        details: error.message
      }),
      { status: 500 }
    );
  }
} 