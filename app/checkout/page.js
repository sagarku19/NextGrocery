'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from '@/hooks/useLocation';
import { supabase } from '@/lib/supabase/client';
import LoginModal from '@/components/LoginModal';
import Image from 'next/image';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, allCartItems, getCartTotal, clearCart, getLocationCart } = useCart();
  const { user } = useAuth();
  const { selectedLocation } = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(!user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  // Get cart items for the current location
  const locationCart = getLocationCart ? getLocationCart() : [];
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    notes: ''
  });

  // Handle successful login from modal
  const handleLoginSuccess = (userData) => {
    console.log('Login successful from modal', userData);
    setIsLoginModalOpen(false);
    
    // Update form data with user information
    if (userData) {
      setFormData(prev => ({
        ...prev,
        name: userData.name || prev.name,
        phone: userData.phone || prev.phone
      }));
    }
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (locationCart.length === 0 && !orderPlaced) {
      router.push('/');
    }
  }, [locationCart, orderPlaced, router]);

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      // Try to get data from localStorage first
      try {
        const storedName = localStorage.getItem('userName');
        const storedPhone = localStorage.getItem('userPhone');
        const storedAddress = localStorage.getItem('userAddress');
        
        if (storedName || storedPhone || storedAddress) {
          console.log('Using user data from localStorage:', { storedName, storedPhone, storedAddress });
          setFormData(prev => ({
            ...prev,
            name: storedName || prev.name,
            phone: storedPhone || prev.phone,
            address: storedAddress || prev.address
          }));
        }
      } catch (e) {
        console.error('Error accessing localStorage:', e);
      }

      // Also try to fetch from database as backup
      const fetchUserProfile = async () => {
        try {
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;

          if (profile) {
            console.log('Using user data from database:', profile);
            setFormData(prev => ({
              ...prev,
              name: profile.name || prev.name || '',
              phone: profile.phone || user.phone || prev.phone || '',
              address: profile.address || prev.address || ''
            }));
            
            // Save address to localStorage if available from database
            if (profile.address) {
              try {
                localStorage.setItem('userAddress', profile.address);
              } catch (e) {
                console.error('Error saving address to localStorage:', e);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };

      fetchUserProfile();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!selectedLocation) {
      setError('Please select a delivery location');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, update user profile with delivery information
      const { error: userUpdateError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          location_id: selectedLocation.id
        });

      if (userUpdateError) {
        console.error('Error updating user profile:', userUpdateError);
        // Continue with order creation even if profile update fails
      } else {
        console.log('User profile updated successfully');
      }

      // Save user data to localStorage for future use
      try {
        localStorage.setItem('userName', formData.name);
        localStorage.setItem('userPhone', formData.phone);
        localStorage.setItem('userAddress', formData.address);
        console.log('Saved user data to localStorage for future orders');
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
      
      // Create order via server-side API route (bypasses RLS)
      const orderData = {
        user_id: user.id,
        location_id: selectedLocation.id,
        total_amount: getCartTotal(),
        delivery_fee: selectedLocation.delivery_fee || 0,
        notes: formData.notes,
        cart: allCartItems
      };
      
      console.log('Sending order data to API:', orderData);
      
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create order');
      }
      
      console.log('Order created successfully:', result);
      
      setOrderId(result.orderId);
      clearCart();
      setOrderPlaced(true);
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <svg
            className="mx-auto h-12 w-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">
            Order Placed Successfully!
          </h2>
          <p className="mt-2 text-gray-600">
            Thank you for your order. We will contact you shortly for delivery.
          </p>
          {orderId && (
            <p className="mt-2 text-sm text-gray-500">
              Order ID: {orderId}
            </p>
          )}
          <button
            onClick={() => router.push('/')}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const deliveryFee = selectedLocation?.delivery_fee || 0;
  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="border-t pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md my-6">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-medium">Cash on Delivery</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Pay with cash when your order is delivered.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
} 