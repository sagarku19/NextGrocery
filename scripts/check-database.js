// Simple script to check if the locations table exists
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Mask API key for security when logging
function maskKey(key) {
  if (!key || typeof key !== 'string') return 'invalid or not set';
  return key.substring(0, 6) + '...' + key.substring(key.length - 4);
}

console.log('=== Database Check Script ===\n');
console.log('Supabase URL:', supabaseUrl);
console.log('Anon Key:', maskKey(supabaseAnonKey));
console.log('Service Role Key:', maskKey(supabaseServiceKey));

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Create a regular Supabase client with the anon key
const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

async function checkTables() {
  try {
    console.log('\nChecking if locations table exists...');
    
    // Try to select from the locations table
    const { data, error } = await supabase
      .from('locations')
      .select('id, name')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST301' || 
          error.message.includes('does not exist') || 
          error.message.includes('not found')) {
        console.log('❌ The locations table does not exist.');
        console.log('\nYour database schema needs to be set up. You can:');
        console.log('1. Use the Supabase web interface SQL editor to run the schema SQL');
        console.log('2. Ensure your API keys have the correct permissions');
        console.log('3. Check if your Supabase project is active');
      } else {
        console.error('Error checking locations table:', error.message);
      }
      return false;
    }
    
    console.log('✅ The locations table exists!');
    
    if (data && data.length > 0) {
      console.log(`Found ${data.length} location(s):`);
      data.forEach(location => {
        console.log(`- ${location.id}: ${location.name}`);
      });
    } else {
      console.log('The locations table exists but is empty.');
    }
    
    // Try other tables
    const tables = ['users', 'categories', 'products', 'inventory', 'orders', 'order_items'];
    console.log('\nChecking other tables...');
    
    for (const table of tables) {
      const { error: tableError } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true });
      
      if (tableError) {
        console.log(`❌ Table ${table}: Does not exist or not accessible`);
      } else {
        console.log(`✅ Table ${table}: Exists and is accessible`);
      }
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}

// Run the check
checkTables()
  .then(success => {
    if (success) {
      console.log('\n✅ Database check completed. Your database is accessible.');
    } else {
      console.log('\n❌ Database check failed. See errors above.');
    }
  })
  .catch(err => {
    console.error('Fatal error:', err);
  }); 