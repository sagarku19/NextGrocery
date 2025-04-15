import twilio from 'twilio';

export default async function handler(req, res) {
  // Only allow GET requests for this test endpoint
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check environment variables
    const envCheck = {
      TWILIO_ACCOUNT_SID: {
        set: !!process.env.TWILIO_ACCOUNT_SID,
        preview: process.env.TWILIO_ACCOUNT_SID ? 
          `${process.env.TWILIO_ACCOUNT_SID.substring(0, 5)}...${process.env.TWILIO_ACCOUNT_SID.substring(process.env.TWILIO_ACCOUNT_SID.length - 5)}` : 
          'not set',
        length: process.env.TWILIO_ACCOUNT_SID?.length || 0,
      },
      TWILIO_AUTH_TOKEN: {
        set: !!process.env.TWILIO_AUTH_TOKEN,
        preview: process.env.TWILIO_AUTH_TOKEN ? 
          `${process.env.TWILIO_AUTH_TOKEN.substring(0, 3)}...${process.env.TWILIO_AUTH_TOKEN.substring(process.env.TWILIO_AUTH_TOKEN.length - 3)}` : 
          'not set',
        length: process.env.TWILIO_AUTH_TOKEN?.length || 0,
      },
      TWILIO_VERIFY_SERVICE_SID: {
        set: !!process.env.TWILIO_VERIFY_SERVICE_SID,
        preview: process.env.TWILIO_VERIFY_SERVICE_SID ? 
          `${process.env.TWILIO_VERIFY_SERVICE_SID.substring(0, 5)}...${process.env.TWILIO_VERIFY_SERVICE_SID.substring(process.env.TWILIO_VERIFY_SERVICE_SID.length - 5)}` : 
          'not set',
        length: process.env.TWILIO_VERIFY_SERVICE_SID?.length || 0,
      }
    };
    
    // Try to initialize Twilio client
    let clientTest = { success: false, error: null };
    let servicesTest = { success: false, error: null, count: 0, services: [] };
    
    try {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      clientTest.success = true;
      
      // Try to list services to verify credentials
      try {
        const services = await client.verify.v2.services.list({ limit: 5 });
        servicesTest.success = true;
        servicesTest.count = services.length;
        servicesTest.services = services.map(s => ({
          sid: s.sid,
          friendlyName: s.friendlyName,
          dateCreated: s.dateCreated
        }));
      } catch (serviceError) {
        servicesTest.error = {
          message: serviceError.message,
          code: serviceError.code || null,
          status: serviceError.status || null
        };
      }
    } catch (clientError) {
      clientTest.error = {
        message: clientError.message,
        code: clientError.code || null
      };
    }

    // Return comprehensive test results
    res.status(200).json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      envVariables: envCheck,
      clientInitialization: clientTest,
      servicesCheck: servicesTest,
      message: clientTest.success && servicesTest.success 
        ? "Twilio credentials verified successfully" 
        : "Twilio credentials check failed, see details"
    });
  } catch (error) {
    console.error('Error during Twilio test:', error);
    res.status(500).json({ 
      error: 'Failed to test Twilio credentials',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 