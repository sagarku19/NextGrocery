// Script to fetch data from Supabase using utility functions
import {
  fetchLocations,
  fetchCategories,
  fetchProducts,
  fetchInventory,
  fetchProductsWithInventory
} from '../lib/supabase/dbUtils';

async function fetchAllData() {
  console.log('=== Fetching data from Supabase database ===\n');
  
  // Step 1: Fetch locations
  console.log('Step 1: Fetching locations...');
  const { data: locations, error: locationsError } = await fetchLocations();
  
  if (locationsError) {
    console.error('Error fetching locations:', locationsError);
  } else {
    console.log(`Found ${locations?.length || 0} active locations:`);
    if (locations && locations.length > 0) {
      locations.forEach(loc => console.log(`- ${loc.name} (ID: ${loc.id})`));
    }
  }
  
  // Step 2: Fetch categories
  console.log('\nStep 2: Fetching categories...');
  const { data: categories, error: categoriesError } = await fetchCategories();
  
  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError);
  } else {
    console.log(`Found ${categories?.length || 0} categories:`);
    if (categories && categories.length > 0) {
      categories.forEach(cat => console.log(`- ${cat.name} (ID: ${cat.id})`));
    }
  }
  
  // Step 3: Fetch products
  console.log('\nStep 3: Fetching products...');
  const { data: products, error: productsError } = await fetchProducts();
  
  if (productsError) {
    console.error('Error fetching products:', productsError);
  } else {
    console.log(`Found ${products?.length || 0} active products`);
    if (products && products.length > 0) {
      console.log('First 3 products:');
      products.slice(0, 3).forEach(product => 
        console.log(`- ${product.name} ($${product.price}) - Category ID: ${product.category_id}`)
      );
    }
  }
  
  // Step 4: Fetch inventory for the first location (if available)
  if (locations && locations.length > 0) {
    const firstLocation = locations[0];
    console.log(`\nStep 4: Fetching inventory for ${firstLocation.name}...`);
    
    const { data: productsWithInventory, error: inventoryError } = 
      await fetchProductsWithInventory(firstLocation.id);
    
    if (inventoryError) {
      console.error('Error fetching inventory:', inventoryError);
    } else {
      console.log(`Found ${productsWithInventory?.length || 0} products with inventory at ${firstLocation.name}`);
      if (productsWithInventory && productsWithInventory.length > 0) {
        console.log('Sample inventory items:');
        productsWithInventory.slice(0, 3).forEach(item => 
          console.log(`- ${item.name}: ${item.stock_quantity} in stock`)
        );
      }
    }
  }
  
  console.log('\n=== Data fetching complete ===');
}

// Run the fetch operation and handle errors
fetchAllData().catch(error => {
  console.error('Fatal error running fetch script:', error);
}); 