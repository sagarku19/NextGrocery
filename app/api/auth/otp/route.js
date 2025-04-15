import { NextResponse } from 'next/server';
import twilio from 'twilio';

// Initialize Twilio client with environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

console.log('Twilio credentials (otp route):', {
  hasAccountSid: !!accountSid,
  accountSidPrefix: accountSid ? accountSid.substring(0, 4) : 'not set',
  hasAuthToken: !!authToken,
  authTokenLength: authToken?.length || 0,
  hasServiceSid: !!serviceSid,
  serviceSidPrefix: serviceSid ? serviceSid.substring(0, 4) : 'not set',
});

// Initialize Twilio client
let client;
try {
  client = twilio(accountSid, authToken);
  console.log('Twilio client initialized successfully in OTP route');
} catch (error) {
  console.error('Error initializing Twilio client in OTP route:', error);
}

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// CORS preflight handler
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

export async function POST(req) {
  try {
    // Check if Twilio client was initialized
    if (!client) {
      console.error('Twilio client is not initialized');
      return NextResponse.json(
        { 
          error: 'Twilio configuration error',
          details: 'Failed to initialize Twilio client. Check server logs for details.'
        },
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Check if Twilio environment variables are set
    if (!accountSid || !authToken || !serviceSid) {
      console.error('Missing Twilio credentials in environment variables');
      return NextResponse.json(
        { 
          error: 'Twilio configuration error',
          details: 'Missing Twilio credentials. Check your .env.local file.'
        },
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
      console.log('Received request data:', JSON.stringify(requestData));
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json(
        { 
          error: 'Invalid request format',
          details: 'Could not parse JSON body'
        },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const { phone, roleType } = requestData;
    console.log('Received OTP request for phone:', phone);
    console.log('Received roleType:', roleType);

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Format phone number
    const formattedPhone = phone.trim().startsWith('+') ? phone : `+${phone}`;

    // Validate phone number format
    if (!/^\+[1-9]\d{1,14}$/.test(formattedPhone)) {
      return NextResponse.json(
        { 
          error: 'Invalid phone number format. Please include country code (e.g., +1 for US)' 
        },
        { status: 400, headers: corsHeaders }
      );
    }

    try {
      console.log('Sending verification to:', formattedPhone);
      console.log('Using Verify service SID:', serviceSid);
      
      // Try SMS channel first
      console.log('Attempting to send verification via SMS...');
      const verification = await client.verify.v2
        .services(serviceSid)
        .verifications
        .create({
          to: formattedPhone,
          channel: 'sms'  // Changed from 'whatsapp' to 'sms'
        });

      console.log('Verification sent:', {
        sid: verification.sid,
        status: verification.status,
        channel: verification.channel
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Verification code sent successfully via SMS',
          status: verification.status,
          channel: verification.channel,
          serviceSid: serviceSid
        },
        { status: 200, headers: corsHeaders }
      );
    } catch (twilioError) {
      // If SMS fails, try voice channel as fallback
      if (twilioError.code === 60410) {
        console.log('SMS channel blocked, trying voice channel...');
        try {
          const voiceVerification = await client.verify.v2
            .services(serviceSid)
            .verifications
            .create({
              to: formattedPhone,
              channel: 'call'  // Use voice call as fallback
            });
          
          console.log('Voice verification sent:', {
            sid: voiceVerification.sid,
            status: voiceVerification.status,
            channel: voiceVerification.channel
          });
          
          return NextResponse.json(
            {
              success: true,
              message: 'Verification code sent successfully via phone call',
              status: voiceVerification.status,
              channel: voiceVerification.channel,
              serviceSid: serviceSid
            },
            { status: 200, headers: corsHeaders }
          );
        } catch (voiceError) {
          console.error('Voice channel also failed:', {
            code: voiceError.code,
            message: voiceError.message
          });
          
          return NextResponse.json(
            {
              error: 'Unable to send verification code',
              details: 'All verification channels are unavailable for this phone number. Please try a different phone number or contact support.',
              code: voiceError.code
            },
            { status: 403, headers: corsHeaders }
          );
        }
      }
      
      console.error('Twilio API Error:', {
        code: twilioError.code,
        message: twilioError.message,
        moreInfo: twilioError.moreInfo,
        status: twilioError.status
      });
      
      // Handle specific Twilio error codes
      let errorMessage = 'Failed to send verification code';
      let errorDetails = twilioError.message || 'Unknown error';
      let statusCode = 500;
      
      // Handle specific error codes
      if (twilioError.code === 20003) {
        errorMessage = 'Twilio authentication failed';
        errorDetails = 'The Account SID or Auth Token provided is incorrect.';
      } else if (twilioError.code === 60200) {
        errorMessage = 'Invalid phone number format';
        errorDetails = 'Please provide a valid phone number with country code (e.g., +1 for US)';
        statusCode = 400;
      } else if (twilioError.code === 20404) {
        errorMessage = 'Verification service not found';
        errorDetails = 'The Twilio Verify service ID is invalid or not accessible';
        statusCode = 400;
      } else if (twilioError.code === 20429) {
        errorMessage = 'Too many verification attempts';
        errorDetails = 'Please try again later';
        statusCode = 429;
      } else if (twilioError.code === 60203) {
        errorMessage = 'Maximum send attempts reached';
        errorDetails = 'Please try again later';
        statusCode = 429;
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorDetails,
          code: twilioError.code
        },
        { status: statusCode, headers: corsHeaders }
      );
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send verification code',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500, headers: corsHeaders }
    );
  }
} 