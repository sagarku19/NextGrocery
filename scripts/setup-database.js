// Script to set up the database schema
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Mask API key for security when logging
function maskKey(key) {
  if (!key || typeof key !== 'string') return 'invalid or not set';
  return key.substring(0, 6) + '...' + key.substring(key.length - 4);
}

console.log('=== Database Setup Script ===\n');
console.log('Supabase URL:', supabaseUrl);
console.log('Service Role Key:', maskKey(supabaseServiceKey));

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

// Create a Supabase client with the service role key for admin operations
console.log('Creating Supabase client with service role key...');
const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false, // service role keys don't need refresh
      persistSession: false
    }
  }
);

// Schema SQL - this is the main database schema
const schemaSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create locations table
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table (extends Supabase auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE,
    name VARCHAR(100),
    email VARCHAR(255),
    address TEXT,
    location_id INTEGER REFERENCES locations(id),
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'driver')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    category_id INTEGER REFERENCES categories(id),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create inventory table (tracks stock by location)
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, location_id)
);

-- Create orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    location_id INTEGER REFERENCES locations(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'processing', 'assigned', 'out-for-delivery', 'delivered', 'canceled')),
    driver_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_inventory_product_location ON inventory(product_id, location_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_driver ON orders(driver_id);
CREATE INDEX idx_orders_location ON orders(location_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_products_category ON products(category_id);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to orders table
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Apply trigger to inventory table
CREATE TRIGGER set_inventory_timestamp
BEFORE UPDATE ON inventory
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
`;

// Sample data SQL - this adds some initial data
const sampleDataSQL = `
-- Insert sample locations
INSERT INTO locations (name, postal_code, delivery_fee, is_active) 
VALUES 
('Downtown', '10001', 2.99, true),
('Westside', '10002', 3.99, true),
('Eastside', '10003', 3.99, true),
('Northend', '10004', 4.99, true);

-- Insert sample categories
INSERT INTO categories (name, display_order, image_url) 
VALUES 
('Fruits', 1, 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'),
('Vegetables', 2, 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1772&q=80'),
('Dairy', 3, 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'),
('Bakery', 4, 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'),
('Meat', 5, 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80');

-- Insert sample products
INSERT INTO products (name, description, price, category_id, image_url) 
VALUES 
('Organic Apples', 'Fresh organic apples from local farms', 3.99, 1, 'https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'),
('Bananas', 'Ripe and ready to eat bananas', 1.99, 1, 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1772&q=80'),
('Carrots', 'Fresh carrots bundle', 2.49, 2, 'https://images.unsplash.com/photo-1582515073490-39981397c445?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1769&q=80'),
('Broccoli', 'Organic broccoli', 2.99, 2, 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'),
('Whole Milk', 'Fresh whole milk from local dairy', 4.49, 3, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80'),
('Cheddar Cheese', 'Aged cheddar cheese', 5.99, 3, 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'),
('Fresh Bread', 'Freshly baked bread', 3.49, 4, 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'),
('Croissants', 'Butter croissants (4 pack)', 6.99, 4, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80'),
('Ground Beef', 'Lean ground beef (1 lb)', 7.99, 5, 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'),
('Chicken Breast', 'Boneless chicken breast (1 lb)', 6.99, 5, 'https://images.unsplash.com/photo-1584913428292-21a1ca9a1f52?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80');

-- Insert sample inventory (stock for each product at each location)
INSERT INTO inventory (product_id, location_id, stock_quantity)
SELECT p.id, l.id, FLOOR(RANDOM() * 25) + 5
FROM products p
CROSS JOIN locations l;
`;

// Helper functions SQL
const helperFunctionsSQL = `
-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get order total
CREATE OR REPLACE FUNCTION calculate_order_total(order_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  total DECIMAL(10,2);
BEGIN
  SELECT SUM(price * quantity)
  INTO total
  FROM order_items
  WHERE order_items.order_id = calculate_order_total.order_id;
  
  RETURN total;
END;
$$ LANGUAGE plpgsql;
`;

// RLS policies SQL
const rlsPoliciesSQL = `
-- Enable RLS on all tables
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Locations: Readable by everyone, writable by admins
CREATE POLICY "Locations are viewable by everyone"
ON locations FOR SELECT USING (true);

CREATE POLICY "Locations are editable by admins only"
ON locations FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Locations are updatable by admins only"
ON locations FOR UPDATE USING (is_admin());

CREATE POLICY "Locations are deletable by admins only"
ON locations FOR DELETE USING (is_admin());

-- Categories: Readable by everyone, writable by admins
CREATE POLICY "Categories are viewable by everyone"
ON categories FOR SELECT USING (true);

CREATE POLICY "Categories are editable by admins only"
ON categories FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Categories are updatable by admins only"
ON categories FOR UPDATE USING (is_admin());

CREATE POLICY "Categories are deletable by admins only"
ON categories FOR DELETE USING (is_admin());

-- Products: Readable by everyone, writable by admins
CREATE POLICY "Products are viewable by everyone"
ON products FOR SELECT USING (true);

CREATE POLICY "Products are editable by admins only"
ON products FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Products are updatable by admins only"
ON products FOR UPDATE USING (is_admin());

CREATE POLICY "Products are deletable by admins only"
ON products FOR DELETE USING (is_admin());

-- Inventory: Readable by everyone, writable by admins
CREATE POLICY "Inventory is viewable by everyone"
ON inventory FOR SELECT USING (true);

CREATE POLICY "Inventory is editable by admins only"
ON inventory FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Inventory is updatable by admins only"
ON inventory FOR UPDATE USING (is_admin());

CREATE POLICY "Inventory is deletable by admins only"
ON inventory FOR DELETE USING (is_admin());

-- Users: Users can view and edit their own profile, admins can view and edit all
CREATE POLICY "Users can view their own profile"
ON users FOR SELECT USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE USING (auth.uid() = id OR is_admin());

CREATE POLICY "Admins can insert users"
ON users FOR INSERT WITH CHECK (is_admin() OR auth.uid() = id);

CREATE POLICY "Admins can delete users"
ON users FOR DELETE USING (is_admin());

-- Orders: Users can view and create their own orders, admins and assigned drivers can view all
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT USING (
  auth.uid() = user_id OR 
  is_admin() OR 
  auth.uid() = driver_id
);

CREATE POLICY "Users can create their own orders"
ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders (if not delivered)"
ON orders FOR UPDATE USING (
  (auth.uid() = user_id AND status NOT IN ('delivered', 'canceled')) OR 
  is_admin() OR 
  (auth.uid() = driver_id AND status IN ('assigned', 'out-for-delivery'))
);

CREATE POLICY "Admins can delete orders"
ON orders FOR DELETE USING (is_admin());

-- Order Items: Users can view their own order items, admins can view all
CREATE POLICY "Users can view their own order items"
ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR is_admin() OR orders.driver_id = auth.uid())
  )
);

CREATE POLICY "Users can insert their own order items"
ON order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
    AND orders.status = 'new'
  )
);

CREATE POLICY "Users cannot update order items"
ON order_items FOR UPDATE USING (false);

CREATE POLICY "Admins can delete order items"
ON order_items FOR DELETE USING (is_admin());
`;

// Define the SQL blocks to execute in order
const sqlBlocks = [
  { name: 'Schema SQL', sql: schemaSQL },
  { name: 'Helper Functions', sql: helperFunctionsSQL },
  { name: 'RLS Policies', sql: rlsPoliciesSQL },
  { name: 'Sample Data', sql: sampleDataSQL }
];

async function executeSql(sql, name) {
  console.log(`Executing ${name}...`);
  
  try {
    // For Supabase, we need to use their RPC method to execute SQL
    const { error } = await supabase.rpc('exec_sql', { query: sql });
    
    if (error) {
      console.error(`❌ Error executing ${name}:`, error.message);
      return false;
    }
    
    console.log(`✅ Successfully executed ${name}`);
    return true;
  } catch (err) {
    console.error(`❌ Error executing ${name}:`, err.message);
    return false;
  }
}

async function setupDatabase() {
  try {
    console.log('Checking connection with service role key...');
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Connection failed:', error.message);
      console.log('\nTrying to check database connection another way...');
      
      // Try a simple query to test connection
      const { data: versionData, error: versionError } = await supabase
        .from('pg_stat_activity')
        .select('count(*)')
        .limit(1);
      
      if (versionError) {
        console.error('Database connection test failed:', versionError.message);
        
        if (versionError.message.includes('permission denied') || 
            versionError.message.includes('not found')) {
          console.log('\nTrying to check if the supabase_functions schema exists...');
          
          // Try a simple query to test connection to another table
          const { data: functionsData, error: functionsError } = await supabase
            .from('supabase_functions')
            .select('count(*)')
            .limit(1);
            
          if (functionsError) {
            console.error('Cannot connect to supabase_functions:', functionsError.message);
          } else {
            console.log('Connected to supabase_functions successfully!');
          }
        }
        
        console.log('\nIt seems that your Supabase database might not allow direct SQL execution through the exec_sql RPC method. This is needed to set up the database schema.');
        console.log('Please consider:');
        console.log('1. Verifying your SUPABASE_SERVICE_ROLE_KEY is correct');
        console.log('2. Using the Supabase web interface SQL editor to run the schema SQL');
        console.log('3. Contacting Supabase support if you believe this should work');
        
        return false;
      }
      
      console.log('Database connection successful!');
    } else {
      console.log('Auth connection successful!');
    }
    
    // Test if the exec_sql function exists
    console.log('\nChecking if the exec_sql RPC function exists...');
    
    try {
      await supabase.rpc('exec_sql', { query: 'SELECT 1;' });
      console.log('✅ exec_sql RPC function exists!');
    } catch (rpcError) {
      console.error('❌ The exec_sql RPC function does not exist or is not accessible:', rpcError.message);
      console.log('This function is needed to execute SQL statements for database setup.');
      console.log('\nPlease create this function in your Supabase project by running the following SQL in the Supabase SQL editor:');
      console.log(`
CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
END;
$$;
      `);
      return false;
    }
    
    console.log('\nBeginning database setup...');
    
    // Execute each SQL block in order
    for (const block of sqlBlocks) {
      const success = await executeSql(block.sql, block.name);
      if (!success) {
        console.log('❌ Database setup failed. See errors above.');
        return false;
      }
    }
    
    console.log('\n✅ Database setup completed successfully!');
    return true;
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}

// Run the database setup
setupDatabase()
  .then(success => {
    if (success) {
      console.log('\nYour database is now ready to use!');
    } else {
      console.log('\nDatabase setup encountered errors. Please check the output above.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  }); 