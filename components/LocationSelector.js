'use client';

import { useLocation } from '@/hooks/useLocation';

export default function LocationSelector() {
  const { 
    locations, 
    selectedLocation, 
    selectLocation, 
    isLoading, 
    error, 
    retryFetchLocations,
    useFallback
  } = useLocation();

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600 text-sm">
          {useFallback ? 'Using demo data - ' : ''}
          Error loading locations: {error.message || String(error)}
        </p>
        <button 
          onClick={retryFetchLocations}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <select
          value={selectedLocation?.id || ''}
          onChange={(e) => {
            const locationId = parseInt(e.target.value);
            const location = locations.find(loc => loc.id === locationId);
            if (location) {
              selectLocation(location);
            }
          }}
          className={`w-full pl-9 py-2 border rounded-lg appearance-none pr-8 text-sm font-medium ${
            isLoading ? 'bg-slate-100' : 'bg-white'
          } ${error ? 'border-red-300' : 'border-slate-200'} focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-colors`}
          disabled={isLoading}
          style={{ 
            backgroundColor: 'white',
            color: '#334155'
          }}
        >
          <option value="" disabled style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>
            {isLoading ? 'Loading locations...' : 'Select delivery location'}
          </option>
          {locations.map(location => (
            <option 
              key={location.id} 
              value={location.id} 
              style={{ 
                backgroundColor: selectedLocation?.id === location.id ? '#e2f8f6' : 'white',
                color: '#334155',
                padding: '8px'
              }}
            >
              {location.name} {location.delivery_fee > 0 ? '(Delivery available)' : '(Free Delivery)'}
              {useFallback ? ' (Demo)' : ''}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
} 