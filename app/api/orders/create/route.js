import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables with correct fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log the environment variables (without revealing full credentials)
console.log('Creating orders API:', {
  hasUrl: !!supabaseUrl,
  hasServiceKey: !!supabaseServiceKey,
  serviceKeyPrefix: supabaseServiceKey?.substring(0, 10) || 'not set',
});

// Create a Supabase client with service role (admin) privileges
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

export async function POST(req) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers });
  }

  try {
    // Parse request body
    const orderData = await req.json();
    console.log('Received order data:', orderData);
    
    // Validate required fields
    if (!orderData.user_id || !orderData.cart || !orderData.location_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers }
      );
    }

    // 1. Create the order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: orderData.user_id,
        location_id: orderData.location_id,
        total_amount: orderData.total_amount,
        delivery_fee: orderData.delivery_fee || 0,
        status: 'new'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return new Response(
        JSON.stringify({ error: orderError.message }),
        { status: 500, headers }
      );
    }

    // 2. If notes provided, save them
    if (orderData.notes) {
      const { error: notesError } = await supabaseAdmin
        .from('order_notes')
        .insert({
          order_id: order.id,
          notes: orderData.notes,
          created_at: new Date().toISOString()
        });
      
      if (notesError) {
        console.error('Error saving order notes:', notesError);
        // Continue even if notes saving fails
      }
    }

    // 3. Create order items
    const orderItems = orderData.cart.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      return new Response(
        JSON.stringify({ error: itemsError.message }),
        { status: 500, headers }
      );
    }

    // Success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId: order.id,
        message: 'Order created successfully' 
      }),
      { status: 200, headers }
    );
    
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error', details: error.message }),
      { status: 500, headers }
    );
  }
} 