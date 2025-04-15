// Database utility functions
import { supabase } from './client';

/**
 * Fetches data from any table in Supabase
 * @param {string} tableName - The name of the table to fetch from
 * @param {Object} options - Options for the query
 * @param {string} options.select - Fields to select (default: '*')
 * @param {number} options.limit - Limit the number of rows (default: 50)
 * @param {Object} options.filter - Filter conditions { column: value }
 * @param {string} options.orderBy - Column to order by
 * @param {boolean} options.ascending - Order direction (default: true)
 * @returns {Promise<Object>} - { data, error }
 */
export async function fetchFromTable(tableName, options = {}) {
  try {
    console.log(`Fetching data from ${tableName}...`);
    
    // Set default options
    const {
      select = '*',
      limit = 50,
      filter = {},
      orderBy = null,
      ascending = true
    } = options;
    
    // Start building the query
    let query = supabase
      .from(tableName)
      .select(select)
      .limit(limit);
    
    // Apply filters
    Object.entries(filter).forEach(([column, value]) => {
      query = query.eq(column, value);
    });
    
    // Apply ordering if specified
    if (orderBy) {
      query = ascending ? query.order(orderBy) : query.order(orderBy, { ascending: false });
    }
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching from ${tableName}:`, error.message);
      return { error };
    }
    
    console.log(`Successfully fetched ${data?.length || 0} records from ${tableName}`);
    return { data };
  } catch (err) {
    console.error(`Unexpected error fetching from ${tableName}:`, err.message);
    return { error: err };
  }
}

/**
 * Fetches all locations
 * @param {boolean} activeOnly - If true, only fetch active locations
 * @returns {Promise<Object>} - { data, error }
 */
export async function fetchLocations(activeOnly = true) {
  const filter = activeOnly ? { is_active: true } : {};
  return fetchFromTable('locations', {
    filter,
    orderBy: 'name'
  });
}

/**
 * Fetches all categories
 * @returns {Promise<Object>} - { data, error }
 */
export async function fetchCategories() {
  return fetchFromTable('categories', {
    orderBy: 'display_order'
  });
}

/**
 * Fetches products with optional filtering
 * @param {Object} options - Filter options
 * @param {number} options.categoryId - Filter by category ID
 * @param {boolean} options.availableOnly - Only fetch available products
 * @returns {Promise<Object>} - { data, error }
 */
export async function fetchProducts(options = {}) {
  const { categoryId, availableOnly = true } = options;
  
  const filter = {};
  
  if (categoryId) {
    filter.category_id = categoryId;
  }
  
  if (availableOnly) {
    filter.is_available = true;
  }
  
  return fetchFromTable('products', {
    filter,
    orderBy: 'name'
  });
}

/**
 * Fetches inventory for products at a specific location
 * @param {number} locationId - The location ID to fetch inventory for
 * @returns {Promise<Object>} - { data, error }
 */
export async function fetchInventory(locationId) {
  if (!locationId) {
    return { error: { message: 'Location ID is required' } };
  }
  
  return fetchFromTable('inventory', {
    select: `
      *,
      products (
        id,
        name,
        price,
        image_url,
        category_id
      )
    `,
    filter: { location_id: locationId }
  });
}

/**
 * Fetches products with inventory for a specific location
 * @param {number} locationId - The location ID
 * @param {number} categoryId - Optional category ID filter
 * @returns {Promise<Object>} - { data, error }
 */
export async function fetchProductsWithInventory(locationId, categoryId = null) {
  try {
    if (!locationId) {
      return { error: { message: 'Location ID is required' } };
    }
    
    // Build the query
    let query = supabase
      .from('products')
      .select(`
        *,
        categories (id, name),
        inventory!inner (stock_quantity, location_id)
      `)
      .eq('inventory.location_id', locationId)
      .eq('is_available', true)
      .gt('inventory.stock_quantity', 0);
    
    // Add category filter if provided
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching products with inventory:', error);
      return { error };
    }
    
    // Transform the data for easier consumption
    const transformedProducts = data.map(product => ({
      ...product,
      stock_quantity: product.inventory[0]?.stock_quantity || 0,
      category: product.categories,
      inventory: undefined,
      categories: undefined
    }));
    
    return { data: transformedProducts };
  } catch (err) {
    console.error('Unexpected error fetching products with inventory:', err);
    return { error: err };
  }
} 