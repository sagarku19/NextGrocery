'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import Link from 'next/link';
import LoginModal from './LoginModal';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    getCartTotal, 
    getCartItemCount, 
    updateCartItemQuantity,
    removeFromCart
  } = useCart();
  
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setIsCartOpen]);

  // Prevent scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Cart Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Your Cart ({getCartItemCount()})</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {cart.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add items to your cart to see them here.</p>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto p-4">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 p-3 rounded-lg border border-gray-100 bg-white shadow-sm">
                    {/* Product Image */}
                    <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        src={item.image || 'https://images.unsplash.com/photo-1580797343513-91ae45ad9b42?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3'}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="64px"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">
                        ₹{(item.sale_price || item.price).toFixed(2)} × {item.quantity}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded">
                          <button
                            onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-xs"
                          >
                            -
                          </button>
                          <span className="px-2 py-1 text-xs text-gray-800 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateCartItemQuantity(item.id, Math.min(10, item.quantity + 1))}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-xs"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold">₹49.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 mb-6">
                <span>Total</span>
                <span>₹{(getCartTotal() + 49.00).toFixed(2)}</span>
              </div>
              
              {!user ? (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors text-center"
                >
                  Login to Checkout
                </button>
              ) : (
                <Link
                  href="/checkout"
                  className="block w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors text-center"
                  onClick={() => setIsCartOpen(false)}
                >
                  Proceed to Checkout
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsLoginModalOpen(false);
        }}
      />
    </div>
  );
}