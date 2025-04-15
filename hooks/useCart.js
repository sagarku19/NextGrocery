'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useLocation } from './useLocation';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();
  const { selectedLocation } = useLocation();

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('nextGroceryCart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('nextGroceryCart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);
  
  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    if (!selectedLocation) {
      alert('Please select a location first');
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.locationId === selectedLocation.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && item.locationId === selectedLocation.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...product,
          quantity,
          locationId: selectedLocation.id,
          locationName: selectedLocation.name,
        },
      ];
    });
    
    // Open cart drawer when item is added
    setIsCartOpen(true);
  };
  
  // Update item quantity
  const updateCartItemQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  // Remove item from cart
  const removeFromCart = (productId, locationId) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.id === productId && item.locationId === locationId)
      )
    );
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('nextGroceryCart');
  };
  
  // Get cart item count
  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };
  
  // Get cart total price
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.sale_price || item.price;
      return total + (price * item.quantity);
    }, 0);
  };
  
  // Toggle cart open/close
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  // Get filtered cart items for current location
  const getLocationCart = () => {
    if (!selectedLocation) {
      // During initial load, don't filter by location to ensure cart is visible
      return cart;
    }
    
    // When location is selected, filter the cart by that location
    const locationId = selectedLocation.id;
    const filteredCart = cart.filter(item => item.locationId === locationId);
    
    // Log for debugging
    console.log(`Filtering cart for location ${locationId}:`, { 
      allItems: cart.length,
      filteredItems: filteredCart.length 
    });
    
    return filteredCart;
  };

  // Provide a way to get cart items for a specific location
  const getCartItemsByLocation = (locationId) => {
    if (!locationId) return [];
    return cart.filter(item => item.locationId === locationId);
  };

  // Effect to filter cart when location changes
  useEffect(() => {
    // Just a dependency to make sure the component updates when location changes
    console.log('Selected location changed:', selectedLocation?.id);
  }, [selectedLocation]);

  const value = {
    cart,
    allCartItems: cart, // Access to all cart items regardless of location
    selectedLocation,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getCartItemsByLocation,
    getLocationCart, // Provide the function itself
    isCartOpen,
    setIsCartOpen,
    toggleCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 