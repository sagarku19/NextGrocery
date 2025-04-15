'use client';

import { useCart } from '@/hooks/useCart';
import CartDrawer from './CartDrawer';

export default function CartButton() {
  const { toggleCart, getCartTotal, getCartItemCount, isCartOpen } = useCart();

  return (
    <>
      <button
        onClick={toggleCart}
        className="relative flex items-center p-2 text-slate-700 hover:text-teal-600 transition-colors"
        aria-label="Open cart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        
        {getCartItemCount() > 0 && (
          <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {getCartItemCount()}
          </span>
        )}
        
        <span className="ml-2 font-medium hidden sm:inline-block">
          ${getCartTotal().toFixed(2)}
        </span>
      </button>
      
      <CartDrawer />
    </>
  );
} 