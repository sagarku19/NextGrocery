import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const location_id = url.searchParams.get('location_id');
    const category_id = url.searchParams.get('category_id');
    const q = url.searchParams.get('q');

    console.log('Fetching products with params:', {
      location_id,
      category_id,
      q
    });

    if (!location_id) {
      console.log('No location_id provided');
      return NextResponse.json(
        { error: 'Location ID is required' }, 
        { status: 400 }
      );
    }

    const supabase = createClient();
    
    // First, verify the location exists
    const { data: location, error: locationError } = await supabase
      .from('locations')
      .select('id, name')
      .eq('id', location_id)
      .single();

    if (locationError || !location) {
      console.error('Location not found:', locationError);
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    console.log('Found location:', location.name);

    // Query for products with inventory
    let query = supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name
        ),
        inventory!inner (
          stock_quantity,
          location_id
        )
      `)
      .eq('inventory.location_id', location_id)
      .eq('is_available', true)
      .gt('inventory.stock_quantity', 0);

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    if (q) {
      query = query.ilike('name', `%${q}%`);
    }

    const { data: products, error: productsError } = await query;

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return NextResponse.json(
        { error: 'Error fetching products' },
        { status: 500 }
      );
    }

    if (!products || products.length === 0) {
      console.log(`No products found for location: ${location.name} (${location_id})`);
      return NextResponse.json({ products: [] });
    }

    // Transform the data
    const transformedProducts = products.map(product => ({
      ...product,
      stock_quantity: product.inventory?.[0]?.stock_quantity || 0,
      category: product.categories,
      inventory: undefined,
      categories: undefined
    }));

    console.log(`Found ${transformedProducts.length} products for location: ${location.name}`);
    
    return NextResponse.json({ 
      products: transformedProducts,
      location: {
        id: location.id,
        name: location.name
      }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 