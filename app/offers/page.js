'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState(null);
  const [imageError, setImageError] = useState({});
  
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };
  
  const handleImageError = (id) => {
    setImageError(prev => ({...prev, [id]: true}));
  };
  
  const featuredOffers = [
    {
      id: 1,
      title: "New Customer Special",
      description: "Get 20% off your first order when you sign up",
      code: "WELCOME20",
      expiryDate: "May 31, 2025",
      image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      backgroundColor: "bg-gradient-to-r from-teal-500 to-emerald-600",
      textColor: "text-white"
    },
    {
      id: 2,
      title: "Weekend Flash Sale",
      description: "Save 15% on fresh produce this weekend only",
      code: "FRESH15",
      expiryDate: "Every weekend",
      image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1506617564039-2f3b650b7010?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      backgroundColor: "bg-gradient-to-r from-orange-400 to-amber-500",
      textColor: "text-white"
    }
  ];
  
  const regularOffers = [
    {
      id: 3,
      title: "Free Delivery",
      description: "Free delivery on orders over $50",
      code: "FREEDEL50",
      expiryDate: "Ongoing",
      category: "Delivery",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 4,
      title: "Organic Bundle",
      description: "10% off when you buy 3 or more organic products",
      code: "ORGANIC10",
      expiryDate: "May 15, 2025",
      category: "Organic",
      image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1376&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1376&q=80"
    },
    {
      id: 5,
      title: "Dairy Discount",
      description: "15% off all dairy products",
      code: "DAIRY15",
      expiryDate: "April 30, 2025",
      category: "Dairy",
      image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    },
    {
      id: 6,
      title: "Family Pack Discount",
      description: "Save 12% on family size packages",
      code: "FAMILY12",
      expiryDate: "June 15, 2025",
      category: "Family",
      image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1545231027-637d2f6210f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    },
    {
      id: 7,
      title: "Senior Discount",
      description: "10% off every Wednesday for seniors",
      code: "SENIOR10",
      expiryDate: "Every Wednesday",
      category: "Senior",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1447005497901-b3e9ee359e25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    },
    {
      id: 8,
      title: "Refer a Friend",
      description: "Get ₹750 off when your friend makes their first order",
      code: "REFER10",
      expiryDate: "Ongoing",
      category: "Referral",
      image: "https://images.unsplash.com/photo-1542995470-870e12e7e14f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80"
    }
  ];

  // Additional offers with different images
  const seasonalOffers = [
    {
      id: 9,
      title: "Summer Fruits",
      description: "Get 15% off all seasonal summer fruits",
      code: "SUMMER15",
      expiryDate: "August 31, 2025",
      category: "Seasonal",
      image: "https://images.unsplash.com/photo-1528821128474-25f8f7b473f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 10,
      title: "Healthy Snacks",
      description: "Buy 2 get 1 free on all healthy snacks",
      code: "HEALTHY21",
      expiryDate: "July 15, 2025",
      category: "Snacks",
      image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1373&q=80"
    }
  ];
  
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white pt-12 pb-24 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Special Offers & Promotions</h1>
          <p className="max-w-2xl text-lg opacity-90">
            Discover exclusive deals, discounts, and promotions to save on your grocery shopping.
            Use our coupon codes at checkout to enjoy special prices on your favorite products.
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-16">
        {/* Featured Offers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredOffers.map((offer) => (
            <div 
              key={offer.id} 
              className={`rounded-xl shadow-lg overflow-hidden ${offer.backgroundColor}`}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 relative h-48 md:h-auto">
                  <Image 
                    src={imageError[offer.id] ? offer.fallbackImage : offer.image}
                    alt={offer.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    onError={() => handleImageError(offer.id)}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={85}
                  />
                </div>
                <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${offer.textColor}`}>{offer.title}</h2>
                    <p className={`${offer.textColor} opacity-90 mb-4`}>{offer.description}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-white bg-opacity-20 rounded-lg px-3 py-2 flex items-center">
                        <span className={`font-mono font-bold ${offer.textColor}`}>{offer.code}</span>
                        <button 
                          onClick={() => copyToClipboard(offer.code)} 
                          className="ml-2 p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                        >
                          {copiedCode === offer.code ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <div className={`text-sm ${offer.textColor} opacity-80`}>
                        Expires: {offer.expiryDate}
                      </div>
                    </div>
                    <Link 
                      href="/" 
                      className="inline-block bg-white text-teal-600 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Regular Offers */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">More Offers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularOffers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                <div className="relative h-48">
                  <Image 
                    src={imageError[offer.id] ? offer.fallbackImage : offer.image}
                    alt={offer.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    onError={() => handleImageError(offer.id)}
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={80}
                  />
                  <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {offer.category}
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{offer.title}</h3>
                  <p className="text-gray-600 mb-4">{offer.description}</p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="bg-gray-100 rounded-lg px-3 py-2 flex items-center">
                        <span className="font-mono font-medium text-gray-800">{offer.code}</span>
                        <button 
                          onClick={() => copyToClipboard(offer.code)} 
                          className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          {copiedCode === offer.code ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Expires: {offer.expiryDate}</p>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <Link 
                    href="/" 
                    className="block w-full text-center bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-2 rounded-lg font-medium hover:from-teal-600 hover:to-emerald-700 transition-colors"
                  >
                    Use This Offer
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Seasonal Offers */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Seasonal Specials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {seasonalOffers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                <div className="relative h-48">
                  <Image 
                    src={imageError[offer.id] ? offer.fallbackImage : offer.image}
                    alt={offer.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    onError={() => handleImageError(offer.id)}
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    quality={80}
                  />
                  <div className="absolute top-0 right-0 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {offer.category}
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{offer.title}</h3>
                  <p className="text-gray-600 mb-4">{offer.description}</p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="bg-gray-100 rounded-lg px-3 py-2 flex items-center">
                        <span className="font-mono font-medium text-gray-800">{offer.code}</span>
                        <button 
                          onClick={() => copyToClipboard(offer.code)} 
                          className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          {copiedCode === offer.code ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Expires: {offer.expiryDate}</p>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <Link 
                    href="/" 
                    className="block w-full text-center bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-colors"
                  >
                    Use This Offer
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Promotional Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl overflow-hidden shadow-lg">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-3/5 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-4">Subscribe & Save</h2>
              <p className="text-white opacity-90 text-lg mb-6">
                Join our subscription service and save 10% on every delivery. 
                Plus, get exclusive member-only offers and priority delivery slots.
              </p>
              <Link 
                href="/subscription" 
                className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
              >
                Join Now
              </Link>
            </div>
            <div className="md:w-2/5 relative h-64 md:h-auto">
              <Image 
                src="https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
                alt="Subscription service"
                fill
                style={{ objectFit: 'cover' }}
                onError={() => handleImageError('banner')}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 40vw"
                quality={85}
              />
            </div>
          </div>
        </div>
        
        {/* Terms & Conditions */}
        <div className="mt-16 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Terms & Conditions</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Offers cannot be combined with any other promotions unless specifically stated.</p>
            <p>• Discount codes must be entered at checkout to apply the offer.</p>
            <p>• NextGrocery reserves the right to modify or cancel any promotion at any time.</p>
            <p>• Offers are valid only while supplies last.</p>
            <p>• Some restrictions may apply. See individual offer details for specific terms.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 