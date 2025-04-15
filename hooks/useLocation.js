'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { fetchLocations } from '@/lib/supabase/dbUtils';

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useFallback, setUseFallback] = useState(false);

  // Fetch locations from the database
  useEffect(() => {
    async function loadLocations() {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await fetchLocations();
        
        if (fetchError) {
          throw fetchError;
        }
        
        if (data && data.length > 0) {
          setLocations(data);
          setUseFallback(false);
        } else {
          // Fallback to demo data if no locations found
          setLocations([
            { id: 1, name: 'Downtown', postal_code: '10001', delivery_fee: 2.99, is_active: true },
            { id: 2, name: 'Westside', postal_code: '10002', delivery_fee: 3.99, is_active: true },
            { id: 3, name: 'Eastside', postal_code: '10003', delivery_fee: 3.99, is_active: true }
          ]);
          setUseFallback(true);
        }
      } catch (err) {
        console.error('Error loading locations:', err);
        setError(err);
        // Fallback to demo data on error
        setLocations([
          { id: 1, name: 'Downtown', postal_code: '10001', delivery_fee: 2.99, is_active: true },
          { id: 2, name: 'Westside', postal_code: '10002', delivery_fee: 3.99, is_active: true },
          { id: 3, name: 'Eastside', postal_code: '10003', delivery_fee: 3.99, is_active: true }
        ]);
        setUseFallback(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadLocations();
  }, []);

  // Load selected location from localStorage on component mount
  useEffect(() => {
    try {
      const savedLocation = localStorage.getItem('selectedLocation');
      if (savedLocation) {
        const parsedLocation = JSON.parse(savedLocation);
        // Verify the saved location exists in our locations array
        const locationExists = locations.some(loc => loc.id === parsedLocation.id);
        if (locationExists) {
          setSelectedLocation(parsedLocation);
        } else if (locations.length > 0) {
          // If saved location doesn't exist, use the first available location
          setSelectedLocation(locations[0]);
        }
      } else if (locations.length > 0) {
        // Set default location if none is saved
        setSelectedLocation(locations[0]);
      }
    } catch (error) {
      console.error('Error loading location from localStorage:', error);
      if (locations.length > 0) {
        setSelectedLocation(locations[0]);
      }
    }
  }, [locations]);

  // Save selected location to localStorage whenever it changes
  useEffect(() => {
    if (selectedLocation) {
      try {
        localStorage.setItem('selectedLocation', JSON.stringify(selectedLocation));
      } catch (error) {
        console.error('Error saving location to localStorage:', error);
      }
    }
  }, [selectedLocation]);

  const selectLocation = (location) => {
    setSelectedLocation(location);
    setIsModalOpen(false);
  };

  const openLocationModal = () => {
    setIsModalOpen(true);
  };

  const closeLocationModal = () => {
    setIsModalOpen(false);
  };

  const retryFetchLocations = () => {
    setError(null);
    setUseFallback(false);
    // Trigger the locations fetch effect again
    setLocations([]);
  };

  return (
    <LocationContext.Provider
      value={{
        locations,
        selectedLocation,
        selectLocation,
        isModalOpen,
        openLocationModal,
        closeLocationModal,
        isLoading,
        error,
        retryFetchLocations,
        useFallback
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
} 