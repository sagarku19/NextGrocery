import { createClient } from '@supabase/supabase-js';

// Log environment variables for debugging (credentials will be hidden)
console.log('Environment variables loaded for create-user route:', {
  hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
  urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set',
  serviceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) || 'not set',
  serviceKeySuffix: process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-10) || 'not set',
});

// Get Supabase credentials from environment variables with correct fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tjiyaswdbuvmeqilhqca.supabase.co';

// Use the service key from .env.local file
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqaXlhc3dkYnV2bWVxaWxocWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzkzNTQ1NiwiZXhwIjoyMDU5NTExNDU2fQ.ocTQ6jlBdX9uQ5rTMHtLgESpYZZAIuHn_Jp2ORImNLA';

// Log the key we're using
console.log('Using service key:', {
  prefix: supabaseServiceKey.substring(0, 10),
  suffix: supabaseServiceKey.slice(-10)
});

// Create a Supabase client with admin privileges
const supabaseAdmin = createClient(
  supabaseUrl, 
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Log the client creation to debug
console.log('Supabase admin client created with service role key');

export async function POST(req) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers });
  }

  try {
    console.log('Create user API called');
    
    // Check if Supabase client was created successfully
    if (!supabaseAdmin) {
      console.error('Supabase admin client is not initialized');
      return new Response(
        JSON.stringify({ error: 'Database configuration error' }),
        { status: 500, headers }
      );
    }
    
    // Parse the request body
    let phone, name, email, checkOnly, roleType;
    try {
      const body = await req.json();
      phone = body.phone;
      name = body.name;
      email = body.email;
      checkOnly = !!body.checkOnly;
      roleType = body.roleType;
      console.log('Request body parsed:', { phone, name, email, checkOnly, roleType });
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid request format', details: parseError.message }),
        { status: 400, headers }
      );
    }
    
    if (!phone) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { status: 400, headers }
      );
    }

    try {
      // First check if the user already exists
      console.log('Checking if user with phone number already exists:', phone);
      const { data: existingUsers, error: queryError } = await supabaseAdmin
        .from('users')
        .select('id, phone, name, email, role')
        .eq('phone', phone)
        .limit(1);
      
      console.log('Existing user check result:', { 
        hasData: !!existingUsers, 
        dataLength: existingUsers?.length || 0,
        hasError: !!queryError,
        errorMessage: queryError?.message || 'no error',
        checkOnly
      });
      
      if (queryError) {
        console.error('Error checking existing user:', queryError);
        // Continue with creation as this might be a permission error
      } else if (existingUsers && existingUsers.length > 0) {
        // User already exists, return the existing user
        console.log('User already exists, returning existing data:', existingUsers[0]);
        return new Response(
          JSON.stringify({
            success: true,
            user: existingUsers[0],
            isExisting: true
          }),
          { status: 200, headers }
        );
      }
      
      // If checkOnly is true, return that the user doesn't exist
      if (checkOnly) {
        console.log('Check only mode - user does not exist');
        return new Response(
          JSON.stringify({
            success: true,
            isExisting: false
          }),
          { status: 200, headers }
        );
      }
      
      // Generate a UUID for the user
      const uuid = crypto.randomUUID();
      console.log('Generated UUID:', uuid);
      
      // Create user directly in the users table (without auth)
      const userData = {
        id: uuid,
        phone: phone,
        name: name || null,
        email: email || null,
        role: roleType === 'admin' || roleType === 'driver' ? roleType : 'customer',
        created_at: new Date().toISOString()
      };
      
      console.log('Inserting user into database:', userData);
      
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('users')
        .insert(userData)
        .select();
      
      if (profileError) {
        console.error('Database error:', profileError);
        return new Response(
          JSON.stringify({ 
            error: `Failed to create user in database: ${profileError.message}`,
            details: profileError
          }),
          { status: 500, headers }
        );
      }
      
      console.log('User created successfully:', profileData);
      
      return new Response(
        JSON.stringify({
          success: true,
          user: {
            id: uuid,
            phone: phone,
            name: name,
            email: email,
            role: userData.role
          }
        }),
        { status: 200, headers }
      );
      
    } catch (error) {
      console.error('Server error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Server error',
          message: error.message
        }),
        { status: 500, headers }
      );
    }
  } catch (outerError) {
    console.error('Outer error:', outerError);
    return new Response(
      JSON.stringify({ 
        error: 'Server error', 
        message: outerError.message 
      }),
      { status: 500, headers }
    );
  }
} 