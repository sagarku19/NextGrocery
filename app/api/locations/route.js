import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    console.log('Fetching locations from Supabase...');
    
    const { data: locations, error } = await supabase
      .from('locations')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching locations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch locations' },
        { status: 500 }
      );
    }

    if (!locations || locations.length === 0) {
      console.log('No active locations found');
      return NextResponse.json({ locations: [] });
    }

    console.log(`Found ${locations.length} active locations`);
    return NextResponse.json({ locations });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 