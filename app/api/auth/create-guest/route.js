import { createClient } from '@supabase/supabase-js';

// Log environment variables for debugging (credentials will be hidden)
console.log('Environment variables loaded:', {
  hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
  urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set',
});

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
    console.log('Create guest user API called');
    
    // Check if Supabase credentials are set
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials in environment variables');
      return new Response(
        JSON.stringify({ error: 'Database configuration error' }),
        { status: 500, headers }
      );
    }
    
    try {
      // Generate a UUID for the guest user
      const uuid = crypto.randomUUID();
      console.log('Generated UUID for guest user:', uuid);
      
      // Create guest user directly in the users table
      const userData = {
        id: uuid,
        role: 'guest',
        created_at: new Date().toISOString()
      };
      
      console.log('Inserting guest user into database:', userData);
      
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('users')
        .insert(userData)
        .select();
      
      if (profileError) {
        console.error('Database error:', profileError);
        return new Response(
          JSON.stringify({ 
            error: `Failed to create guest user in database: ${profileError.message}`,
            details: profileError
          }),
          { status: 500, headers }
        );
      }
      
      console.log('Guest user created successfully:', profileData);
      
      return new Response(
        JSON.stringify({
          success: true,
          user: {
            id: uuid,
            role: 'guest'
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