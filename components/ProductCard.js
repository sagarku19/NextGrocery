'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation if inside a Link
    if (isAdding) return;
    
    setIsAdding(true);
    addToCart(product, 1);
    
    // Reset after animation
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative group">
      <Link href={`/product/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-50">
          <Image
            src={product.image_url || 'https://images.unsplash.com/photo-1580797343513-91ae45ad9b42?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            priority={false}
          />
          
          {/* Stock Badge */}
          <div className="absolute top-2 right-2">
            {product.stock_quantity > 0 ? (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-100">
                In Stock
              </span>
            ) : (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-100">
                Out of Stock
              </span>
            )}
          </div>
          
          {/* Quick Add Button - Appears on Hover */}
          {product.stock_quantity > 0 && (
            <button
              onClick={handleAddToCart}
              className={`absolute bottom-0 left-0 right-0 py-2 text-sm font-medium 
                ${isAdding ? 'bg-teal-500 text-white' : 'bg-white/90 text-teal-600 hover:bg-teal-50'} 
                backdrop-blur-sm transition-all duration-200 ease-out transform
                ${isAdding ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}
                flex items-center justify-center gap-2`}
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Added!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Quick Add
                </>
              )}
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">{product.name}</h3>
          <div className="flex items-baseline gap-2">
            {product.sale_price ? (
              <>
                <span className="text-lg font-bold text-teal-600">₹{product.sale_price.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through">₹{product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
            )}
          </div>
          
          {/* Category Tag */}
          {product.category && (
            <div className="mt-2">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-50 text-gray-600 rounded-full">
                {product.category.name}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
} 