// app/api/auth/otp/send/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const { phone } = await request.json();
  
  if (!phone) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// app/api/auth/otp/verify/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const { phone, otp } = await request.json();
  
  if (!phone || !otp) {
    return NextResponse.json({ error: 'Phone and OTP are required' }, { status: 400 });
  }
  
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms'
    });
    
    if (error) throw error;
    
    // Check if user exists in our user table
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();
      
    // If not, create a new user entry
    if (!userData) {
      await supabase.from('users').insert({
        phone,
        role: 'customer',
        created_at: new Date().toISOString()
      });
    }
    
    return NextResponse.json({ 
      user: data.user,
      session: data.session
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}