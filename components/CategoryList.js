'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/lib/supabase/client';

export default function CategoryList({ showIcons = true, compact = false }) {
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });
        
        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
          setLoading(false);
          return;
        }
        
        // Map category icons based on name
        const categoriesWithIcons = categoriesData.map(category => {
          let icon = '📦';
          
          if (category.name.toLowerCase().includes('fruit') || category.name.toLowerCase().includes('vegetable')) {
            icon = '🥬';
          } else if (category.name.toLowerCase().includes('dairy') || category.name.toLowerCase().includes('egg')) {
            icon = '🥛';
          } else if (category.name.toLowerCase().includes('bakery') || category.name.toLowerCase().includes('bread')) {
            icon = '🍞';
          } else if (category.name.toLowerCase().includes('beverage') || category.name.toLowerCase().includes('drink')) {
            icon = '🧃';
          } else if (category.name.toLowerCase().includes('snack')) {
            icon = '🍿';
          } else if (category.name.toLowerCase().includes('household')) {
            icon = '🧹';
          }
          
          return {
            ...category,
            icon
          };
        });
        
        setCategories(categoriesWithIcons);
        
        // Fetch preview products for each category
        const previewProducts = {};
        for (const category of categoriesWithIcons) {
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', category.id)
            .eq('is_available', true)
            .limit(2);
            
          if (productsError) {
            console.error(`Error fetching products for category ${category.id}:`, productsError);
            previewProducts[category.id] = [];
          } else {
            previewProducts[category.id] = productsData || [];
          }
        }
        
        setCategoryProducts(previewProducts);
      } catch (err) {
        console.error('Error in data fetching:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 space-y-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-8 bg-slate-200 animate-pulse rounded"></div>
        ))}
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2 p-2">
        {categories.map(category => (
          <Link 
            key={category.id}
            href={`/search?category=${category.id}`}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-sm font-medium text-slate-700 transition-colors"
          >
            {showIcons && <span className="mr-1.5">{category.icon}</span>}
            {category.name}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 w-80 max-h-[70vh] overflow-y-auto">
      {categories.map(category => (
        <div key={category.id} className="p-2">
          <Link 
            href={`/search?category=${category.id}`}
            className="flex items-center px-4 py-2 hover:bg-slate-50 transition-colors rounded-md mb-2"
          >
            {showIcons && (
              <span className="mr-3 flex-shrink-0 text-xl w-7 h-7 flex items-center justify-center">
                {category.icon}
              </span>
            )}
            <span className="text-slate-700 font-medium">{category.name}</span>
          </Link>
          
          {/* Products Grid - 2x1 format */}
          {categoryProducts[category.id]?.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {categoryProducts[category.id].map(product => (
                <div key={product.id} className="bg-white rounded-lg border border-slate-100 overflow-hidden hover:shadow-sm transition-shadow">
                  {/* Product Image */}
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative h-24 overflow-hidden bg-slate-100">
                      <Image
                        src={product.image_url || '/images/product-placeholder.jpg'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 150px"
                        style={{ objectFit: 'cover' }}
                      />
                      {product.sale_price && (
                        <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
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
                      
                      {/* Add to Cart */}
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
          
          <Link 
            href={`/search?category=${category.id}`}
            className="block text-center text-xs text-teal-600 hover:text-teal-700 mt-2 font-medium"
          >
            View all {category.name}
          </Link>
        </div>
      ))}
    </div>
  );
} 