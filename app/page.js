'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocation } from '@/hooks/useLocation';
import { useCart } from '@/hooks/useCart';
import ProductCard from '@/components/ProductCard';
import LocationSelector from '@/components/LocationSelector';
import ProductSearch from '@/components/ProductSearch';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedLocation } = useLocation();
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      if (!selectedLocation) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetch(`/api/products?location_id=${selectedLocation.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedLocation]);

  // Categories for display
  const categories = [
    { id: '1', name: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=500&auto=format&fit=crop' },
    { id: '2', name: 'Dairy & Eggs', image: 'https://images.unsplash.com/photo-1628689469838-524a4a973b8e?q=80&w=500&auto=format&fit=crop' },
    { id: '3', name: 'Bakery', image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=500&auto=format&fit=crop' },
    { id: '4', name: 'Beverages', image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=500&auto=format&fit=crop' },
    { id: '5', name: 'Snacks', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=500&auto=format&fit=crop' },
    { id: '6', name: 'Household', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=500&auto=format&fit=crop' },
  ];

  // Group products by category
  const getProductsByCategory = (categoryId) => {
    return products
      .filter(product => product.category_id === parseInt(categoryId))
      .slice(0, 4); // Show up to 4 products per category
  };

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <section className="relative h-44 md:h-64 lg:h-80 overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop"
          alt="Fresh groceries"
          fill
          priority={true}
          style={{ objectFit: 'cover', objectPosition: 'center 80%' }}
          className="brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-md">
              Fresh Groceries, Fast Delivery
            </h1>
            <p className="text-lg md:text-xl text-white max-w-2xl mx-auto drop-shadow-md">
              Get fresh groceries delivered to your doorstep in minutes
            </p>
          </div>
        </div>
      </section>

      {/* Small Product By Category Nav */}
      <section className="bg-white py-3 shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center overflow-x-auto pb-1 hide-scrollbar gap-2">
            <Link href="/" className="flex-shrink-0 px-3 py-1.5 text-sm font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors">
              All
            </Link>
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/search?category=${category.id}`}
                className="flex flex-shrink-0 items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden relative mr-2 border border-gray-200">
                  <Image 
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="24px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative bg-teal-600 text-white overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1506617564039-2f3b650b7010?q=80&w=1600&auto=format&fit=crop"
            alt="Fresh groceries background"
            fill
            priority={true}
            style={{ objectFit: 'cover', objectPosition: 'center 75%' }}
            className="mix-blend-multiply opacity-80"
            sizes="100vw"
          />
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">Choose Your Preferred Location</h1>
              <p className="text-base sm:text-lg mb-6 text-teal-100">
                Get Fresh Groceries Delivered to Your Doorstep
              </p>
              <div className="max-w-full md:max-w-md p-3 md:p-4 bg-white/15 backdrop-blur-sm rounded-lg shadow-lg">
                <LocationSelector />
              </div>
            </div>
            <div className="w-full md:w-1/2 md:pl-8">
              <div className="grid grid-cols-3 grid-rows-2 gap-3 md:gap-4">
                {categories.map((category, index) => (
                  <Link 
                    href={`/search?category=${category.id}`}
                    key={index} 
                    className="relative rounded-lg overflow-hidden aspect-square shadow-lg transform transition-transform hover:scale-105 border-2 border-white/20"
                  >
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-300"
                      sizes="(max-width: 768px) 30vw, 15vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10"></div>
                    <div className="absolute bottom-0 left-0 w-full p-2 text-center">
                      <h3 className="font-medium text-white text-sm drop-shadow-md">{category.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-6 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 text-center">Search Products by Category</h2>
            <ProductSearch />
          </div>
        </div>
      </section>

      {/* Categories Section with Products Grid */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center text-slate-800">Shop by Category</h2>
          
          {!selectedLocation ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-slate-100 mt-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-16 md:w-16 mx-auto text-teal-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-slate-700 text-lg font-medium">Please select a location to view available products</p>
              <p className="text-slate-500 mt-2">Choose your delivery location from the selector in the menu</p>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-16">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Categories with Products */}
              {categories.map((category) => {
                const categoryProducts = getProductsByCategory(category.id);
                return (
                  <div key={category.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Category Header */}
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="100vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute inset-0 flex items-center justify-between px-4">
                        <div>
                          <h3 className="text-xl font-bold text-white">{category.name}</h3>
                        </div>
                        <Link 
                          href={`/search?category=${category.id}`}
                          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-3 py-1 rounded-full text-white text-sm font-medium transition-colors flex items-center"
                        >
                          View All
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Mobile-friendly Products Grid - 2 columns */}
                    {categoryProducts.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 divide-x divide-y divide-gray-100">
                        {categoryProducts.map(product => (
                          <div key={product.id} className="p-3 hover:bg-gray-50 transition-colors">
                            <Link href={`/product/${product.id}`} className="block">
                              <div className="aspect-square relative overflow-hidden rounded-lg mb-2">
                                {product.image_url ? (
                                  <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="(max-width: 768px) 40vw, 25vw"
                                    className="hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                                {product.stock_quantity > 0 ? (
                                  <div className="absolute top-1 right-1">
                                    <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                      In Stock
                                    </span>
                                  </div>
                                ) : (
                                  <div className="absolute top-1 right-1">
                                    <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                      Out
                                    </span>
                                  </div>
                                )}
                              </div>
                              <h4 className="font-medium text-slate-900 text-sm line-clamp-1">{product.name}</h4>
                              <p className="text-teal-600 font-bold text-sm">${product.price.toFixed(2)}</p>
                            </Link>
                            
                            {/* Add to Cart Button - smaller for mobile */}
                            {product.stock_quantity > 0 ? (
                              <button 
                                onClick={() => addToCart(product, 1)}
                                className="mt-1 w-full bg-teal-50 hover:bg-teal-100 text-teal-600 text-xs font-medium py-1 rounded-md transition-colors flex items-center justify-center"
                                aria-label={`Add ${product.name} to cart`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Add
                              </button>
                            ) : (
                              <button 
                                disabled
                                className="mt-1 w-full bg-gray-100 text-gray-400 text-xs font-medium py-1 rounded-md cursor-not-allowed"
                              >
                                Out of Stock
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center">
                        <p className="text-slate-500 text-sm">No products available</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-slate-800">Why Choose NextGrocery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-4 md:p-6 card">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-slate-800">Fast Delivery</h3>
              <p className="text-sm md:text-base text-slate-600">Get your groceries delivered within hours of ordering</p>
            </div>
            <div className="text-center p-4 md:p-6 card">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-slate-800">Fresh Quality</h3>
              <p className="text-sm md:text-base text-slate-600">We source the freshest products directly from local farms</p>
            </div>
            <div className="text-center p-4 md:p-6 card">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-slate-800">Great Prices</h3>
              <p className="text-sm md:text-base text-slate-600">Competitive prices on all your favorite grocery items</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}