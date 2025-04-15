'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary-600">NextGrocery</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link href="/" className="px-3 py-2 text-gray-700 hover:text-primary-600">
                Home
              </Link>
              <Link href="/products" className="px-3 py-2 text-gray-700 hover:text-primary-600">
                Products
              </Link>
            </div>
          </div>
          
          {/* User Navigation */}
          <div className="flex items-center">
            {user ? (
              <div className="hidden md:flex items-center">
                <span className="mr-4 text-sm text-gray-700">
                  {user.phone || 'User'}
                </span>
                <button
                  onClick={signOut}
                  className="text-gray-700 hover:text-primary-600"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:inline-block text-gray-700 hover:text-primary-600">
                Sign in
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              <svg
                className={`h-6 w-6 ${isMenuOpen ? 'hidden' : 'block'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`h-6 w-6 ${isMenuOpen ? 'block' : 'hidden'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link 
            href="/"
            className="block px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
          >
            Home
          </Link>
          <Link 
            href="/products"
            className="block px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
          >
            Products
          </Link>
          {user ? (
            <>
              <div className="px-3 py-2 text-sm text-gray-500">
                {user.phone || 'User'}
              </div>
              <button
                onClick={signOut}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link 
              href="/login"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
