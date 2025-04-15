import { NextResponse } from 'next/server';
import twilio from 'twilio';

// Initialize Twilio client with environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

// Log Twilio credentials check
console.log('Twilio credentials (verify route):', {
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
  console.log('Twilio client initialized successfully in verify route');
} catch (error) {
  console.error('Error initializing Twilio client in verify route:', error);
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
      console.error('Twilio verify client is not initialized');
      return NextResponse.json(
        { 
          error: 'Twilio configuration error',
          details: 'Failed to initialize Twilio client. Check server logs for details.'
        },
        { status: 500, headers: corsHeaders }
      );
    }

    // Check if Twilio credentials are set
    if (!accountSid || !authToken || !serviceSid) {
      console.error('Twilio credentials not set. Please check environment variables.');
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: 'Missing Twilio credentials. Check your .env.local file.'
        },
        { status: 500, headers: corsHeaders }
      );
    }

    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
      console.log('Received verify request data:', JSON.stringify(requestData));
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

    const { phone, code, requestServiceSid, roleType } = requestData;
    console.log('Received verification request for phone:', phone);
    console.log('Received roleType:', roleType);

    if (!phone || !code) {
      return NextResponse.json(
        { error: 'Phone number and verification code are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Use the provided service SID from the request or fall back to the environment variable
    const usedServiceSid = requestServiceSid || serviceSid;
    console.log('Using service SID for verification:', usedServiceSid);

    // Format phone number
    const formattedPhone = phone.trim().startsWith('+') ? phone : `+${phone}`;

    try {
      console.log('Attempting to verify code for:', formattedPhone);
      
      // Following Twilio documentation example for verification check
      const verificationCheck = await client.verify.v2
        .services(usedServiceSid)
        .verificationChecks
        .create({
          to: formattedPhone,
          code: code
        });

      console.log('Verification check status:', verificationCheck.status);

      return NextResponse.json(
        {
          success: true,
          status: verificationCheck.status,
          valid: verificationCheck.status === 'approved',
          message: verificationCheck.status === 'approved' 
            ? 'Verification successful' 
            : 'Invalid verification code'
        },
        { status: 200, headers: corsHeaders }
      );
    } catch (twilioError) {
      console.error('Twilio API Error during verification:', {
        code: twilioError.code,
        message: twilioError.message,
        moreInfo: twilioError.moreInfo,
        status: twilioError.status,
        stack: twilioError.stack
      });
      
      // Handle specific Twilio error codes
      let errorMessage = 'Verification failed';
      let errorDetails = 'The verification code may have expired or be invalid';
      let statusCode = 400;
      
      // Handle specific error codes
      if (twilioError.code === 20003) {
        errorMessage = 'Twilio authentication failed';
        errorDetails = 'The Account SID or Auth Token provided is incorrect.';
        statusCode = 500;
      } else if (twilioError.code === 60200) {
        errorMessage = 'Invalid phone number format';
        errorDetails = 'Please provide a valid phone number with country code (e.g., +1 for US)';
      } else if (twilioError.code === 20404) {
        errorMessage = 'Verification service not found';
        errorDetails = 'The Twilio Verify service ID is invalid or not accessible';
      } else if (twilioError.code === 60203) {
        errorMessage = 'Invalid verification code';
        errorDetails = 'The code you entered is incorrect or has expired';
      } else if (twilioError.code === 60202) {
        errorMessage = 'Verification not found';
        errorDetails = 'No verification was requested for this phone number recently';
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
    console.error('API Error during verification:', error);
    return NextResponse.json(
      { 
        error: 'Failed to verify code',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500, headers: corsHeaders }
    );
  }
} 