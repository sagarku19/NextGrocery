'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import ProductCard from '@/components/ProductCard';
import { useLocation } from '@/hooks/useLocation';
import { useCart } from '@/hooks/useCart';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const categoryId = searchParams.get('category') || '';
  const { selectedLocation } = useLocation();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState({});

  // Categories for display with default images (will be replaced if data is fetched from Supabase)
  const defaultCategoryImages = [
    { id: '1', name: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=500&auto=format&fit=crop' },
    { id: '2', name: 'Dairy & Eggs', image: 'https://images.unsplash.com/photo-1628689469838-524a4a973b8e?q=80&w=500&auto=format&fit=crop' },
    { id: '3', name: 'Bakery', image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=500&auto=format&fit=crop' },
    { id: '4', name: 'Beverages', image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=500&auto=format&fit=crop' },
    { id: '5', name: 'Snacks', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=500&auto=format&fit=crop' },
    { id: '6', name: 'Household', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=500&auto=format&fit=crop' },
  ];

  useEffect(() => {
    async function searchProducts() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch category name if categoryId is provided
        if (categoryId) {
          try {
            const { data: categoryData, error: categoryError } = await supabase
              .from('categories')
              .select('name, image_url')
              .eq('id', categoryId)
              .single();
              
            if (categoryError) {
              console.error('Error fetching category:', categoryError);
              // Fall back to default categories
              const defaultCategory = defaultCategoryImages.find(cat => cat.id === categoryId);
              if (defaultCategory) {
                setCategory({ name: defaultCategory.name });
              }
            } else if (categoryData) {
              setCategory(categoryData);
            }
          } catch (err) {
            console.error('Error in category fetch:', err);
            // Fall back to default categories
            const defaultCategory = defaultCategoryImages.find(cat => cat.id === categoryId);
            if (defaultCategory) {
              setCategory({ name: defaultCategory.name });
            }
          }
        } else {
          setCategory(null);
        }

        try {
          // Build the query for products
          let productsQuery = supabase
            .from('products')
            .select('*, category:categories(name)');
          
          // Add filters
          if (categoryId) {
            productsQuery = productsQuery.eq('category_id', categoryId);
          }
          
          if (query) {
            productsQuery = productsQuery.ilike('name', `%${query}%`);
          }
          
          // Execute query
          const { data: productsData, error: productsError } = await productsQuery;
          
          if (productsError) {
            console.error('Error searching products:', productsError);
            setError('Failed to load products. Please try again later.');
            setProducts([]);
          } else {
            setProducts(productsData || []);
          }
        } catch (err) {
          console.error('Error in products fetch:', err);
          setError('Failed to load products. Please try again later.');
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    }
    
    // Fetch all categories for the category navigation
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, image_url');
          
        if (error) {
          console.error('Error fetching categories:', error);
          setCategories(defaultCategoryImages);
          return;
        }
        
        // Map the data to include default images if image_url is missing
        const categoriesWithImages = data.map(cat => ({
          ...cat,
          image: cat.image_url || defaultCategoryImages.find(c => c.id === cat.id)?.image || defaultCategoryImages[0].image
        }));
        
        setCategories(categoriesWithImages || defaultCategoryImages);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories(defaultCategoryImages);
      }
    }

    // Load preview products for each category
    async function loadCategoryPreviewProducts() {
      try {
        // First get the categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id');
          
        if (categoriesError) {
          console.error('Error fetching categories for preview products:', categoriesError);
          return;
        }
        
        const previewProducts = {};
        // Fetch 2 products for each category
        for (const cat of categoriesData) {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', cat.id)
            .limit(2);
            
          if (error) {
            console.error(`Error fetching preview products for category ${cat.id}:`, error);
            previewProducts[cat.id] = [];
          } else {
            previewProducts[cat.id] = data || [];
          }
        }
        setCategoryProducts(previewProducts);
      } catch (err) {
        console.error('Error loading category preview products:', err);
      }
    }
    
    searchProducts();
    fetchCategories();
    loadCategoryPreviewProducts();
  }, [query, categoryId, selectedLocation]);

  // Construct the title based on search parameters
  const constructTitle = () => {
    if (query && category) {
      return `Results for "${query}" in ${category.name}`;
    } else if (query) {
      return `Search results for "${query}"`;
    } else if (category) {
      return `Products in ${category.name}`;
    } else {
      return 'All Products';
    }
  };

  // Add a function to get the product count text
  const getProductCountText = () => {
    if (products.length === 0) {
      return 'No products found';
    } else if (products.length === 1) {
      return '1 product found';
    } else {
      return `${products.length} products found`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Simple top navigation with back button and search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <Link 
          href="/" 
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const searchInput = e.target.elements.search.value;
          if (searchInput) {
            const params = new URLSearchParams();
            params.set('query', searchInput);
            if (categoryId) params.set('category', categoryId);
            window.location.href = `/search?${params.toString()}`;
          }
        }} className="flex-grow max-w-md">
          <div className="relative">
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              defaultValue={query}
              className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar with categories */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Categories</h2>
              {!loading && (
                <span className="text-sm text-slate-500 font-medium">{getProductCountText()}</span>
              )}
            </div>
            
            <div className="space-y-4">
              <Link 
                href="/search"
                className={`block px-3 py-2 rounded-md transition-colors ${!categoryId ? 'bg-teal-50 text-teal-600 font-medium' : 'hover:bg-gray-50'}`}
              >
                All Products
              </Link>
              
              {categories.map((cat) => (
                <div key={cat.id} className="space-y-2">
                  <Link 
                    href={`/search?category=${cat.id}${query ? `&query=${query}` : ''}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${categoryId === cat.id ? 'bg-teal-50 text-teal-600 font-medium' : 'hover:bg-gray-50'}`}
                  >
                    <div className="relative h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="32px"
                      />
                    </div>
                    <span>{cat.name}</span>
                  </Link>
                  
                  {/* Products Grid - 2x1 format */}
                  {categoryProducts[cat.id]?.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 px-2">
                      {categoryProducts[cat.id].map(product => (
                        <div key={product.id} className="bg-white rounded-lg border border-slate-100 overflow-hidden hover:shadow-sm transition-shadow">
                          {/* Product Image */}
                          <Link href={`/product/${product.id}`} className="block">
                            <div className="relative h-20 overflow-hidden bg-slate-100">
                              <Image
                                src={product.image_url || '/images/product-placeholder.jpg'}
                                alt={product.name}
                                fill
                                sizes="(max-width: 640px) 50vw, 100px"
                                style={{ objectFit: 'cover' }}
                              />
                              {product.sale_price && (
                                <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded-full">
                                  Sale
                                </div>
                              )}
                            </div>
                            
                            {/* Product Info */}
                            <div className="p-2">
                              <h4 className="text-xs font-medium text-slate-800 line-clamp-1">{product.name}</h4>
                              <div className="flex items-center mt-1">
                                {product.sale_price ? (
                                  <>
                                    <span className="text-xs font-bold text-slate-900">${product.sale_price.toFixed(2)}</span>
                                    <span className="ml-1 text-xs text-slate-500 line-through">${product.price.toFixed(2)}</span>
                                  </>
                                ) : (
                                  <span className="text-xs font-bold text-slate-900">${product.price.toFixed(2)}</span>
                                )}
                              </div>
                              
                              {/* Add to Cart button */}
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  addToCart(product, 1);
                                }}
                                className="w-full mt-1 py-1 text-xs bg-teal-600 hover:bg-teal-700 text-white rounded font-medium transition-colors"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="lg:w-3/4">
          {/* Title and category header */}
          {category && categoryId && (
            <div className="mb-6">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 h-32 md:h-40">
                {/* Category image */}
                {category.image_url && (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    style={{ objectFit: 'cover', opacity: 0.7 }}
                    className="absolute inset-0"
                    sizes="100vw"
                    priority
                  />
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                
                {/* Category name */}
                <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-md">{category.name}</h1>
                  <p className="text-white/90 text-sm md:text-lg max-w-2xl">
                    Explore our selection of {category.name.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Title for search or all products */}
          {(!category || !categoryId) && (
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">{constructTitle()}</h1>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              <p>{error}</p>
            </div>
          )}
          
          {/* Products grid */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-700 text-lg font-medium">No products found</p>
              <p className="text-slate-500 mt-2">Try a different search term or category</p>
              {query && (
                <Link 
                  href={categoryId ? `/search?category=${categoryId}` : '/search'} 
                  className="mt-4 inline-block text-teal-600 hover:text-teal-700"
                >
                  Clear search
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 